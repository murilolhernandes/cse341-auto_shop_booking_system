const passport = require('passport');
//Using api401Error for consistency in error handling.

const Api401Error = require('../error-handling/api401Error');

const login = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return passport.authenticate('google', { scope: ['profile', 'email'] })(
      req,
      res,
      next
    );
  }
  res.redirect('/');
};

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new Api401Error('Unauthorized', 401, 'You do not have access.');
  }
  next();
};

module.exports = {
  login,
  isAuthenticated,
};
