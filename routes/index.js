const router = require('express').Router(); 
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {

  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out");
  
});

router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.use("/clients", require("./client"));


router.use("/user", require("./user"));

module.exports = router;
