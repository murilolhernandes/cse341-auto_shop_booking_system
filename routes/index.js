const router = require('express').Router();
const authentication = require('../utilities/authenticate');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  res.send(
    req.isAuthenticated()
      ? `<h1>Logged in using ${
          req.user.googleId
            ? 'Google'
            : req.user.githubId
              ? 'GitHub'
              : 'No provider info'
        }:</h1> <h2>Name: ${req.user.firstName} ${req.user.lastName}</h2><p>Email/Username: ${req.user.email}</p><button onclick="window.location.href='/logout'">Logout</button>`
      : `<h1>Logged out</h1>
      <button onclick="window.location.href='/login'">Login with Google</button>
      <button onclick="window.location.href='/login/github'">Login with GitHub</button>`
  );
});

// eslint-disable-next-line no-unused-vars
router.get('/login', authentication.login, (req, res) => {});

// eslint-disable-next-line no-unused-vars
router.get('/login/github', authentication.loginGH, (req, res) => {});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    // Remove old sessions to keep db clean
    req.session.destroy(function (err) {
      if (err) {
        console.log('Error destroying session:', err);
      }
      res.redirect('/');
    });
  });
});

router.use('/client', require('./client'));
router.use('/car', require('./car'));
router.use('/user', require('./user'));
router.use('/appointment', require('./appointment'));

module.exports = router;
