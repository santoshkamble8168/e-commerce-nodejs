const User = require("../models/userModel")
const ErrorHander = require("../utils/errorHandler")
const handleAsyncErrors = require("../middlewares/handleAsyncErrors")
const sendTokenCookie = require("../utils/jwtTokenCookie")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

//register user
exports.registerUser = handleAsyncErrors( async(req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "test id",
            url: "test url"
        }
    })

    sendTokenCookie(user, "User created successfully", 201, res)
})


//forgot password
exports.forgotPassword = handleAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return next(new ErrorHander("Please provide valid email", 404))
    }

    //get resetpassword token
    const resetToken = user.generateResetPasswordToken()

    //save resset token on db
    await user.save({validateBeforeSave: false})

    const resetPasswordUrl = `${process.env.PASSWORD_RESET_URI}/${resetToken}`
    const message = `Your password reset token is: \n\n ${resetPasswordUrl} \n\n if you have not requested this then please ignore this.` 

    try {
        await sendEmail({
            email: user.email,
            subject: "E-comm password recovery system",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPassword.resetToken = undefined
        user.resetPassword.resetTokenExpire = undefined
        await user.save({validateBeforeSave: false})
        return next(new ErrorHander(error.message, 500))
    }
})

//reset password
exports.resetPassword = handleAsyncErrors(async(req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        "resetPassword.resetToken" : resetPasswordToken, 
        "resetPassword.resetTokenExpire": {$gt: Date.now()}
    })

    if (!user) {
        return next(new ErrorHander("Invalid reset password token or has been expired", 401))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("password not matched", 401))
    }

    user.password = req.body.password
    user.resetPassword.resetToken = undefined
    user.resetPassword.resetTokenExpire = undefined
    await user.save()

    sendTokenCookie(user, undefined, 200, res)
})

//update password
exports.updatePassword = handleAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.verifyPassword( req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("Password not matched", 400))
    }

    user.password = req.body.newPassword
    await user.save()

    sendTokenCookie(user, "Password updated successfully", 200, res)
})

exports.getUsers = handleAsyncErrors(async (req, res, next) => {
    const users = await User.find()
})

exports.getUserDetails = handleAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHander("User not found", 401))
    }

    res.status(200).json({
        success: true,
        item: user
    })
})

//loggedin user details
exports.getProfile = handleAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        item: user
    })
})