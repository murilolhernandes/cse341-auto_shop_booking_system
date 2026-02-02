const express = require('express');
const mongodb = require('./db/connect');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

// Setup the server to accept bodyParser (to parse the data from the DB), passport (validate the user through Google OAuth2.0), and set the API headers.
app
  .use(bodyParser.json())
  .use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
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

// Setup the passport authentication using Google OAuth2.0
// Remove this line when authentication is setup and working, and uncomment the lines below.
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: process.env.CALLBACK_URL
//   },
//   function(accessToken, refreshToken, profile, done) {
//     return done(null, profile);
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// app.get('/google/callback', passport.authenticate('google', {
//   failureRedirect: '/api-docs', session: false}),
//   (req, res) => {
//     req.session.user = req.user;
//     res.redirect('/');
//   });

// Once we have the DB working, simply remove this line and uncomment the function bellow.
// mongodb.initDb((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     app.listen(port);
//     console.log(`Connected to DB and listening on ${port}`);
//   }
// });

// Once the DB is working, remove this line and the next two. They were meant to be used while the DB was not setup.
app.listen(port);
console.log(`Listening on ${port}`);