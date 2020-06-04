const user = require('../models/user');
const post = require('../models/post');
const express = require('express');
const router = express.Router();
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = (passport) => {
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'dsdy4#%$#hsgdfY%dRDgs65fgsdfdfT%$$35a3s54H\h/fbfd'
        },
        function (jwtPayload, cb) {
            return user.findById(jwtPayload.id)
                .then(user => cb(null, user))
                .catch(err => cb(err));
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        user.findById(id, (err, user) => {
            done(err, user);
        });
    });

    router.get('/me', passport.authenticate('jwt', {session: false}), (req, res) => {
        res.json(req.user);
    });

    router.get('/', (req, res) => {
        res.json();
    });

    router.post('/register', async (req, res) => {
        try {
            if (!req.body.username || !req.body.password) return res.status(400).json({message: "Please fill username and password"});
            if (req.body.password !== req.body.repeat) return res.status(400).json({message: "Password does nor match"});
            let data = await user.findOne({login: req.body.username});
            if (data) return res.status(400).json({message: "This username is already exist"});
            data = await user.insert(req.body.username, req.body.password, req.body.fullname);
            const token = jwt.sign({id: data.id}, 'dsdy4#%$#hsgdfY%dRDgs65fgsdfdfT%$$35a3s54H\h/fbfd');
            return res.json({data, token});
        } catch (err) {
            res.status(500).json(err);
        }
    });

    router.post('/login', async (req, res) => {
        try {
            if (!req.body.username || !req.body.password) return res.status(400).json({message: "Please fill username and password"});
            let data = await user.findOne({login: req.body.username});
            if (!data || !await data.verifyPassword(req.body.password)) return res.status(400).json({message: "Wrong password or username"});
            const token = jwt.sign({id: data.id}, 'dsdy4#%$#hsgdfY%dRDgs65fgsdfdfT%$$35a3s54H\h/fbfd');
            return res.json({user: data, token});
        } catch (err) {
            res.status(500).json(err);
        }
    });

    router.use('/users', passport.authenticate('jwt', {session: false}), checkAdmin);

    router.route('/users')
        .get(async (req, res) => {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            if (page < 1) return res.sendStatus(400);
            let count = 9;
            let search = req.query.search;
            let query = new RegExp(search, "i");
            try {
                let pages = await user.countDocuments({login: query});
                search = pages;
                if (page > pages && pages !== 0) return res.sendStatus(400);
                let data = await user.find().skip((page - 1) * count).limit(count).exec();
                pages = Math.ceil(pages / count);
                res.json({items: data, page: page, pages: pages, search: search});
            } catch (err) {
                res.status(500).json(err);
            }
        })
        .post(async (req, res) => {
            try {
                let data = await user.findOne({login: req.body.username});
                if (!data) {
                    data = await user.insert(req.body.username, req.body.password, req.body.fullname);
                    res.status(201).json(data);
                } else {
                    res.status(400).json({message: "This user is already exist"});
                }
            } catch (error) {
                res.status(500).json(error);
            }
        });
    router.route('/users/:id')
        .get((req, res) => {
            user.findById(req.params.id)
                .then(data => {
                    if (!data) return res.sendStatus(404);
                    res.json(data);
                })
                .catch(err => {
                    if (err.name === "CastError") return res.sendStatus(404);
                    res.status(500).json(err);
                });
        })
        .put((req, res) => {
            user.update(req.params.id, req.body.avaUrl, req.body.fullname, req.body.password, req.body.role)
                .then(data => res.json(data))
                .catch(err => res.status(500).json(err));
        })
        .delete((req, res) => {
            Promise.all([user.findByIdAndDelete(req.params.id), post.deleteMany({user_id: req.params.id})])
                .then(() => res.sendStatus(204))
                .catch(err => res.status(500).send(err))
        })

    router.route('/posts')
        .get(passport.authenticate('jwt', {session: false}), checkAuth, async (req, res) => {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            if (page < 1) return res.sendStatus(400);
            let count = 9;
            let search = req.query.search;
            let query = new RegExp(search, "i");
            try {
                let pages = await post.countDocuments({title: query, user_id: req.user._id});
                search = pages;
                if (page > pages && pages !== 0) return res.sendStatus(400);
                let data = await post.find({
                    title: query,
                    user_id: req.user._id
                }).skip((page - 1) * count).limit(count).exec();
                pages = Math.ceil(pages / count);
                if (req.query.sort === 'late') {
                    data = data.reverse();
                    res.json({items: data, page: page, pages: pages, search: search});
                } else {
                    res.json({items: data, page: page, pages: pages, search: search});
                }
            } catch (err) {
                res.status(500).json(err);
            }
        })
        .post(passport.authenticate('jwt', {session: false}), checkAuth, async (req, res) => {
            try {
                if (!req.body) return res.sendStatus(400);
                let data = await post.insert(req.body, req.user.id, req.body.posterUrl, req.body.description);
                res.status(201).json(data);
            } catch (err) {
                res.status(500).json(err);
            }
        });

    router.route('/posts/:id')
        .get(passport.authenticate('jwt', {session: false}), checkAuth, async (req, res) => {
            post.find({_id: req.params.id, user_id: req.user._id})
                .then(data => {
                    if (!data) return res.sendStatus(404);
                    res.json(data);
                })
                .catch(err => {
                    if (err.name === "CastError") return res.sendStatus(404);
                    res.status(500).json(err);
                });
        })
        .put(passport.authenticate('jwt', {session: false}), checkAuth, async (req, res) => {
            try {
                let data = await post.findById(req.params.id);
                if (req.user.id.toString() !== data.user_id.toString()) {
                    res.sendStatus(403);
                } else {
                    await post.update(req.params.id, req.body.title, req.body.description);
                    let data1 = await post.findById(req.params.id);
                    await res.json(data1);
                }
            } catch (err) {
                res.status(500).json(err);
            }
        })
        .delete(passport.authenticate('jwt', {session: false}), checkAuth, async (req, res) => {
            try {
                let data = await post.findById(req.params.id);
                if (req.user.id.toString() !== data.user_id.toString()) {
                    res.sendStatus(403);
                } else {
                    await post.findByIdAndDelete(req.params.id);
                    res.sendStatus(204);
                }
            } catch (err) {
                res.status(500).json(err);
            }
        });
    router.route('/gallery')
        .get((req, res) => {
            post.find({}, {poster: 1})
                .then(data => {
                    if (!data) return res.sendStatus(404);
                    data.sort(makeRandomArr);
                    let new_arr = [];
                    for (let i = 0; i < 10; i++) {
                        let new_arr_elem = {};
                        new_arr_elem.original = data[i].poster;
                        new_arr.push(new_arr_elem);
                    }
                    res.json(new_arr);
                })
                .catch(err => {
                    if (err.name === "CastError") return res.sendStatus(404);
                    res.status(500).json(err);
                });
        });

    router.get('*', (req, res) => res.sendStatus(404));
    return router
};

function checkAuth(req, res, next) {
    if (!req.user) return res.status(401).json();
    next();
}

function checkAdmin(req, res, next) {
    if (!req.user) res.sendStatus(401);
    else if (req.user.role !== 1) res.status(403).json();
    else next();
}

function makeRandomArr(a, b) {
    return Math.random() - 0.5;
}
