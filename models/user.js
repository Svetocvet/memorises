const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

let userSchema = new mongoose.Schema({
    login: String,
    password: String,
    fullname: String,
    role: {type: Number, default: 0},
    registeredAt: Date,
    avaUrl: {type: String, default: 'https://res.cloudinary.com/hlrzutjus/image/upload/v1573071583/default_gvkyv9.png'},
    isDisabled: {type: Boolean, default: false}
}, {
    versionKey: false
});

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.insert = async function (username, password, fullname) {
    try
    {
        let obj = {login: username};
        let hash = await bcrypt.hash(password, saltRounds);
        obj.password = hash;
        let date = new Date();
        obj.registeredAt = date.toISOString().slice(0, 19) + 'Z';
        obj.fullname = fullname;
        let User = this.model('Users');
        let user = new User(obj);
        return user.save();
    }
    catch(err)
    {
        return Promise.reject(err);
    }
};

userSchema.statics.update = async function(id, ava, fullname, password, role) {
    try
    {
        let hash;
        let obj = {};
        if (password && password !== "") {
            hash = await bcrypt.hash(password, saltRounds);
            obj.password = hash;
        }
        if (fullname && fullname !== "") {
            obj.fullname = fullname;
        }
        if (role) {
            obj.role = role;
        }
        if(ava) {
            obj.avaUrl = ava;
        }
        return User.findByIdAndUpdate(id, obj);
    }
    catch(err)
    {
        return Promise.reject(err);
    }
}

const User = mongoose.model('Users', userSchema);

module.exports = User;
