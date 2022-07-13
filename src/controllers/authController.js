const User = require("../models/userModel")
const ErrorHander = require("../utils/errorHandler")
const handleAsyncErrors = require("../middlewares/handleAsyncErrors")
const sendTokenCookie = require("../utils/jwtTokenCookie")

//login user
exports.loginUser = handleAsyncErrors(async(req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHander("Please enter Eamil and password", 400))
    }

    //check uset is exist or not
    const user = await User.findOne({email}).select("+password")
    if (!user) {
        return next(new ErrorHander("Invalid Eamil or password", 401))
    }

    const isPasswordMatched = await user.verifyPassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid Eamil or password", 401))
    }

    sendTokenCookie(user, undefined, 200, res)
})

//logout user
exports.logoutUser = handleAsyncErrors(async(req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    })
})