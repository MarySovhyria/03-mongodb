const HttpError = require('../helpers/HttpError')


const isEmptyBody = async (req, res, next) => {
    const {length} = Object.keys(req.body);
    if(!length) {
        return next(HttpError(400, "missing fields"));
    }
    next();
}
module.exports = isEmptyBody;