//Using api400Error for consistency in error handling.
const Api400Error = require("../error-handling/api400Error");
const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //const errorsExtract = errors
     // .array()
     // .map((item) => ({ [item.path]: item.msg }));

    throw new Api400Error(
      "Invalid Client ID",
      undefined,
      `The provided client id ${req.params.id} is not a valid Id.`,
    );
    //return res.status(400).json({ errors: errorsExtract });
  }
  next();
}

module.exports = validate;
