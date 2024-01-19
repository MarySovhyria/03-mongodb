const express = require('express');
const isValidId = require("../../midlewares/isValidId");
const isEmptyBody = require('../../midlewares/isEmptyBody')
const {userSignInSchema, userSignUpSchema} =  require('../../models/User');
const validateBody = require('../../decorators/validateBody');
const authController = require('../../controllers/auth-controller');
const authenticate = require('../../midlewares/authenticate')
const upload = require('../../midlewares/upload')

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, authController.register);
authRouter.get("/verify/:verificationCode", authController.verify);
authRouter.post('/verify', isEmptyBody, authController.resendEmail);
authRouter.post('/login', isEmptyBody, authController.login);
authRouter.get('/current', authenticate, authController.current);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.patch('/avatars', authenticate, upload.single("avatarURL"), authController.updateAvatar)

module.exports = authRouter;