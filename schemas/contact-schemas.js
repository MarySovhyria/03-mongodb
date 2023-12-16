const Joi = require('joi');

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" must be exist`
  }),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
};
