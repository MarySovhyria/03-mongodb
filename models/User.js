const { Schema, model } = require("mongoose");
const Joi = require('joi');
const { handleSaveError, setUpdate } = require("./hooks");  

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        unique: true,
        match: emailRegexp,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
    },
    avatarURL: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    verify: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
}, { versionKey: false, timestamps: true });

userSchema.pre("findOneAndUpdate", setUpdate)
userSchema.post("save", handleSaveError)
userSchema.post("findOneAndUpdate", handleSaveError)

const userSignUpSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userSignInSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const User = model("user", userSchema);

module.exports = User;