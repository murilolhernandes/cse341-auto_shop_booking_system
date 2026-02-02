const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //#swagger.tags=['Index Page']
  // Remove this line and uncomment the line bellow once authentication is up and running.
  // res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out");
  res.send("Welcome to the Auto Shop Booking System API").json;
})

module.exports = router;