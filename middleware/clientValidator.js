const { body } = require("express-validator");
const validate = require("../utilities/validate");

const createValidationRules = [
  body("firstName")
    .isString()
    .withMessage("firstName must be a String")
    .notEmpty()
    .withMessage("firstName cannot be empty"),
  body("lastName")
    .isString()
    .withMessage("lastName must be a String")
    .notEmpty()
    .withMessage("lastName cannot be empty"),
  body("email")
    .isEmail()
    .withMessage("must be a valid email")
    .notEmpty()
    .withMessage("email cannot be empty"),
  body("phone")
    .isMobilePhone()
    .withMessage("must be a valid mobile phone number")
    .notEmpty()
    .withMessage("phone cannot be empty"),
];

const updateValidationRules = [
  body("firstName")
    .isString()
    .withMessage("firstName must be a String")
    .optional(),
  body("lastName")
    .isString()
    .withMessage("lastName must be a String")
    .optional(),
  body("email").isEmail().withMessage("must be a valid email").optional(),
  body("phone")
    .isMobilePhone()
    .withMessage("must be a valid mobile phone number")
    .optional(),
];

const { isValidObjectId } = require("mongoose");

function validateIdParam(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ errors: [{ id: "invalid id parameter" }] });
  }
  next();
}

module.exports = {
  validateCreate: [...createValidationRules, validate],
  validateUpdate: [...updateValidationRules, validate],
  validateDeleteOne: validateIdParam,
  validateGetOne: validateIdParam,
};
