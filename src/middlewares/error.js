const ErrorHander = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server error"

    //handle mongoDB error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHander(message, 400)
    }

    //mongodb duplicate key error handle
    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} already exists`
        err = new ErrorHander(message, 409)
    }

    //handle wrong JWT token
    if (err.name === "JsonWebTokenEror") {
        const message = "Invalid token, please try again"
        err = new ErrorHander(message, 401)
    }

    //handle JWT token expire
    if (err.name === "TokenExpiredError") {
        const message = "Token is expired"
        err = new ErrorHander(message, 401)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}