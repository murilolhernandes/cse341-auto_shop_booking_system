const { isValidObjectId } = require('mongoose');

function validateIdParam(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ errors: [{ id: 'invalid id parameter' }] });
  }
  next();
}

module.exports = validateIdParam;
