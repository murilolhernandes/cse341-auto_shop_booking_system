const { body } = require('express-validator');
const validate = require('../utilities/validate');
const validateIdParam = require('../utilities/validateIdParam');

const createValidationRules = [
  body('firstName')
    .isString()
    .withMessage('firstName must be a String')
    .notEmpty()
    .withMessage('firstName cannot be empty'),
  body('lastName')
    .isString()
    .withMessage('lastName must be a String')
    .notEmpty()
    .withMessage('lastName cannot be empty'),
  body('email')
    .isEmail()
    .withMessage('must be a valid email')
    .notEmpty()
    .withMessage('email cannot be empty'),
  body('phone')
    .isMobilePhone()
    .withMessage('must be a valid mobile phone number')
    .notEmpty()
    .withMessage('phone cannot be empty'),
  body('dob')
    .isDate()
    .withMessage('must be a valid date')
    .notEmpty()
    .withMessage('phone cannot be empty'),
];

const updateValidationRules = [
  body('firstName')
    .isString()
    .withMessage('firstName must be a String')
    .optional(),
  body('lastName')
    .isString()
    .withMessage('lastName must be a String')
    .optional(),
  body('email').isEmail().withMessage('must be a valid email').optional(),
  body('phone')
    .isMobilePhone()
    .withMessage('must be a valid mobile phone number')
    .optional(),
  body('dob').isDate().withMessage('must be a valid date').optional(),
];

module.exports = {
  validateCreate: [...createValidationRules, validate],
  validateUpdate: [...updateValidationRules, validate],
  validateDeleteOne: validateIdParam,
  validateGetOne: validateIdParam,
};
