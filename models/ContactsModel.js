const { Schema, model } = require("mongoose");
const Joi = require('joi');
const { handleSaveError, setUpdate } = require("./hooks");

const contactSchema = new Schema(
    {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  }, { versionKey: false, timestamps: true }
);

contactSchema.pre("findOneAndUpdate", setUpdate)
contactSchema.post("save", handleSaveError)
contactSchema.post("findOneAndUpdate", handleSaveError)

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" must be exist`
  }),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  // favorite: Joi.boolean().required(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean()
  
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
});

const Contact = model('contact', contactSchema);

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
  Contact
};
