const { body } = require("express-validator");
const validate = require("./validate");
const validateIdParam = require("./validateIdParam");

const createValidationRules = [
  body("userId")
    .isMongoId()
    .withMessage("User ID must be a valid ObjectId")
    .notEmpty()
    .withMessage("User ID cannot be empty"),
  body("clientId")
    .isMongoId()
    .withMessage("Client ID must be a valid ObjectId")
    .notEmpty()
    .withMessage("Client ID cannot be empty"),
  body("carId")
    .isMongoId()
    .withMessage("Car ID must be a valid ObjectId")
    .notEmpty()
    .withMessage("Car ID cannot be empty"),
  body("date")
    .isDate({ format: "MM/DD/YYYY", strictMode: true })
    .withMessage("Date must be in MM/DD/YYYY format")
    .notEmpty()
    .withMessage("Date cannot be empty")
];

const updateValidationRules = [
  body("userId")
    .isMongoId()
    .withMessage("User ID must be a valid ObjectId")
    .notEmpty()
    .withMessage("User ID cannot be empty"),
  body("clientId")
    .isMongoId()
    .withMessage("Client ID must be a valid ObjectId")
    .notEmpty()
    .withMessage("Client ID cannot be empty"),
  body("carId")
    .isMongoId()
    .withMessage("Car ID must be a valid ObjectId")
    .notEmpty()
    .withMessage("Car ID cannot be empty"),
  body("date")
    .isDate({ format: "MM/DD/YYYY", strictMode: true })
    .withMessage("Date must be in MM/DD/YYYY format")
    .notEmpty()
    .withMessage("Date cannot be empty")
];

module.exports = {
  validateCreate: [...createValidationRules, validate],
  validateUpdate: [...updateValidationRules, validate],
  validateDeleteOne: validateIdParam,
  validateGetOne: validateIdParam,
};
