const handleSaveError = (error, data, next) => {
    error.status = 400;
    next();
}

const setUpdate = function(next) {
    this.options.new = true;
    this.options.runValidators = true;
    next()
};


module.exports = {
    handleSaveError,
    setUpdate
};