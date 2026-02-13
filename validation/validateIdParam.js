const { isValidObjectId } = require('mongoose');

function validateIdParam(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ errors: [{ id: 'Invalid ID parameter' }] });
  }
  next();
}

module.exports = validateIdParam;
