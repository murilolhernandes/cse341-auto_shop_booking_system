const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsExtract = errors
      .array()
      .map((item) => ({ [item.path]: item.msg }));

    return res.status(400).json({ errors: errorsExtract });
  }
  next();
}

module.exports = validate;
