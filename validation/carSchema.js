const Joi = require("joi");

const carSchema = Joi.object({
  model: Joi.string().min(3).max(30).required(),

  brand: Joi.string().alphanum().min(3).max(30).required(),

  plate: Joi.string().alphanum().min(3).max(12),

  color: Joi.string().min(2).max(30),

  passengers: Joi.number().min(1).max(180),

  doors: Joi.number().min(1).max(8),

  engine_type: Joi.string()
    .valid("Gas", "Diesel", "Electric", "Hybrid")
    .required(),

  transmission: Joi.string().valid("Manual", "Automatic").required(),

  year: Joi.number().min(1900).max(new Date().getFullYear()),
  clientId: Joi.string().alphanum().min(24).max(24).required(),
});

module.exports = {
  carSchema,
};
