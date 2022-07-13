const ErrorHander = require("../utils/errorHandler");
const handleAsyncErrors = require("./handleAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthRequired = handleAsyncErrors( async (req, res, next) => {
    const {token} = req.cookies

    if (!token) {
        return next(new ErrorHander("Please login to access this resource", 401))
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedToken.id)

    next()
})

exports.isAuthorised = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHander(`Role: ${req.user.role} is not allowed to access this resource`, 403))
        }

        next()
    }
}
