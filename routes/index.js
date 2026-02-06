const router = require('express').Router(); 
const authentication = require('../utilities/authenticate');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.firstName}` : "Logged out");
  
});

router.get('/login', authentication.login, (req, res) => {});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.use("/client", require("./client"));


router.use("/user", require("./user"));

module.exports = router;
