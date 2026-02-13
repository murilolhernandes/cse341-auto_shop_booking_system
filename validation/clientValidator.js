const { body } = require('express-validator');
const validate = require('./validate');
const validateIdParam = require('./validateIdParam');

const createValidationRules = [
  body('firstName')
    .isString()
    .withMessage('First name must be a string')
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .isString()
    .withMessage('Last name must be a string')
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .notEmpty()
    .withMessage('Email cannot be empty'),
  body('phone')
    .isMobilePhone('en-US')
    .withMessage('Must be a valid mobile phone number')
    .notEmpty()
    .withMessage('Phone cannot be empty'),
  body('dob')
    .isDate({ format: 'MM/DD/YYYY', strictMode: true })
    .withMessage('Date of birth must be in MM/DD/YYYY format')
    .notEmpty()
    .withMessage('Date of birth cannot be empty'),
];

const updateValidationRules = [
  body('firstName')
    .isString()
    .withMessage('First name must be a string')
    .optional(),
  body('lastName')
    .isString()
    .withMessage('Last name must be a string')
    .optional(),
  body('email').isEmail().withMessage('Must be a valid email').optional(),
  body('phone')
    .isMobilePhone()
    .withMessage('Must be a valid mobile phone number')
    .optional(),
  body('dob').isDate().withMessage('Must be a valid date').optional(),
];

module.exports = {
  validateCreate: [...createValidationRules, validate],
  validateUpdate: [...updateValidationRules, validate],
  validateDeleteOne: validateIdParam,
  validateGetOne: validateIdParam,
};
