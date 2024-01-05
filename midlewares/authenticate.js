require('dotenv').config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const HttpError = require("../helpers/HttpError")
const User = require('../models/User');

const authenticate = async (req, res, next) => {
     const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, "Authorization not define"));
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401));
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user || !user.token || token !== user.token) {
            return next(HttpError(401));
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(HttpError(401, error.message))
    }

}
module.exports = authenticate
