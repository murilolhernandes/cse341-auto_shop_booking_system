const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo').default;

const app = express();
require('./config/passport')(passport);

app
  .use(bodyParser.json())
  .use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
    cookie: {
      maxAge: 8.5 * 60 * 60 * 1000
    }
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, PATCH, OPTIONS, DELETE'
    );
    next();
  })
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
  .use(cors({ origin: '*' }))
  .use('/', require('./routes/'));

app.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/api-docs',
  session: true
}), (req, res) => {
  res.redirect('/');
});

module.exports = app;
