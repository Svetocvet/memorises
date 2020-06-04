const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');

const port =  process.env.PORT || 7777;

const app = express();

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/myproject";

const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(url, connectOptions)
    .then(() => console.log('Mongo database connected'))
    .catch(err => console.log(err));

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(passport.session());

const api = require('./routes/api')(passport);
app.use('/api/v1', api);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
