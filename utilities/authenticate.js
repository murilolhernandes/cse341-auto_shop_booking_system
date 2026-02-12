const passport = require('passport');

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
    return res.status(401).json('You do not have access.');
  }
  next();
};

module.exports = {
  login,
  isAuthenticated,
};
