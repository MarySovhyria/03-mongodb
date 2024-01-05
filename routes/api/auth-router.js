const express = require('express');
const isValidId = require("../../midlewares/isValidId");
const isEmptyBody = require('../../midlewares/isEmptyBody')
const {userSignInSchema, userSignUpSchema} =  require('../../models/User');
const validateBody = require('../../decorators/validateBody');
const authController = require('../../controllers/auth-controller');
const authenticate = require('../../midlewares/authenticate')

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, authController.register);
authRouter.post('/login', isEmptyBody, authController.login);
authRouter.get('/current', authenticate, authController.current);
authRouter.post('/logout', authenticate, authController.logout);

module.exports = authRouter;