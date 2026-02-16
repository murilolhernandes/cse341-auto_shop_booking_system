const Joi = require('joi');

const carSchema = Joi.object({
  model: Joi.string().min(3).max(30).required(),

  brand: Joi.string().min(3).max(30).required(),

  plate: Joi.string()
    .pattern(/^[A-Z0-9\- ]+$/i)
    .min(3)
    .max(12),

  year: Joi.number().min(1900).max(new Date().getFullYear()),

  color: Joi.string().min(2).max(30),

  mileage: Joi.number().min(0).max(1000000),

  passengers: Joi.number().min(1).max(180),

  doors: Joi.number().min(1).max(8),

  engine_type: Joi.string()
    .valid('Gas', 'Diesel', 'Electric', 'Hybrid')
    .required(),

  transmission: Joi.string().valid('Manual', 'Automatic').required(),

  clientId: Joi.string().hex().min(24).max(24).required(),
});

module.exports = {
  carSchema,
};
