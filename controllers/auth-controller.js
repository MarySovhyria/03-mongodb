require('dotenv').config();
const { JWT_SECRET, BASE_URL } = process.env;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require('fs/promises')
const gravatar = require('gravatar');
const jimp = require("jimp")
const path = require('path')
const { nanoid } = require('nanoid')

const User = require('../models/User');
const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../decorators/ctrlWrapper');
const sendEmail = require('../helpers/sendEmail')

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already in use")
    }
    const avatarURL = gravatar.url(email)
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = nanoid()
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL , verificationCode});
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target = "_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Verify email</a>`
    }

    await sendEmail(verifyEmail)

    res.json({
        email: newUser.email,
        subscription: newUser.subscription
    })
}

const verify = async(req, res)=> {
    const { verificationCode } = req.params;

    const user = await User.findOne({ verificationCode });
    console.log(user._id)
    if(!user) {
        throw HttpError(400, "Email not found or already verified");
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""});

    res.json({
        message: "Email verify success"
    })
}

const resendEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "Email not found")
    }
    if (user.verify) {
        throw HttpError(400, 'Email have been verified already')
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target = "_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Verify email</a>`
    }

    await sendEmail(verifyEmail);
    res.json({
        message: "Verification email has been sent"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid")
    }
    if (!user.verify) {
        throw HttpError(401, "Email is not verified")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid")
    }

    const { _id: id } = user;
    const payload = {
        id
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token })
    
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    })
}

const current = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription
    })
}

const logout = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Signout success"
    })
    
}

const updateAvatar = async (req, res) => {
    if (!req.file) {
        throw HttpError(400, "You have not attached any files")
    }
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    const image = await jimp.read(oldPath);
    await image.resize(250, 250);
    await image.writeAsync(oldPath);
    await fs.rename(oldPath, newPath);
    const avatar = path.join("avatars", filename);
    const result = await User.findOneAndUpdate(_id, { avatarURL: avatar });
    if (!result) {
        throw HttpError(401, `Not authorized`);
    }

    res.json({
        "avatarURL": result.avatarURL
    })
    
}


module.exports = {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendEmail: ctrlWrapper(resendEmail),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}
