const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required().min(5).max(25)
});

const dishSchema = Joi.object({
  name: Joi.string().required().min(5),
  description: Joi.string().required().min(10).max(150),
  price: Joi.number().required(),
  category: Joi.string().required()
});

const userSchema = Joi.object({
  _id: Joi.string().required(),
  email: Joi.string().email().required()
});

module.exports = { categorySchema, dishSchema, userSchema };
