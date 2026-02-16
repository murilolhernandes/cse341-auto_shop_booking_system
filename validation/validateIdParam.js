//Using api400Error for consistency in error handling.
const Api400Error = require("../error-handling/api400Error");

const { isValidObjectId } = require("mongoose");

function validateIdParam(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    throw new Api400Error(
      "Invalid Client ID",
      undefined,
      `The provided client id ${req.params.id} is not a valid Id.`,
    );
    //return res.status(400).json({ errors: [{ id: "invalid id parameter" }] });
  }
  next();
}

module.exports = validateIdParam;
