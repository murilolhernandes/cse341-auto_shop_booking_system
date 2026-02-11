const BaseError = require("./baseError");

class Api400Error extends BaseError {
  constructor(description = "Bad Request") {
    super("BAD REQUEST", 400, true, description);
  }
}

module.exports = Api400Error;
