const mongoose = require("mongoose")
const validator = require("validator")
const bcryptJs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        maxLength: [30, "Name can not exceed 30 characters"],
        minLength: [3, "Name should have more than 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        validator: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: [8, "Password should have more than 8 characters"],
        select: false //password is not returning in any find() method
    },
    avatar: {
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPassword: {
        resetToken: {
            type: String
        },
        resetTokenExpire: {
            type: Date
        }
    }
}) 

//bcryptJs password before save/update
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) { //check is incomming request is not a password change request
        next() //if its not then return the next
    }

    //if its a password chnage request do this
    this.password = await bcryptJs.hash(this.password, 10) 
})

//JWT token generation on register user
userSchema.methods.getJwtToken = function(){
    return jwt.sign(
        { id: this._id, role: this.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRE })
}

//verify password
userSchema.methods.verifyPassword = async function(inputPassword){
    return await bcryptJs.compare(inputPassword, this.password)
}

//reset password (generate password reset token)
userSchema.methods.generateResetPasswordToken = function() {
    const token = crypto.randomBytes(20).toString("hex")
    //hassing token
    this.resetPassword.resetToken = crypto.createHash("sha256").update(token).digest("hex")
    this.resetPassword.resetTokenExpire = Date.now() + 15 * 60 * 1000

    return token
}


module.exports = mongoose.model("User", userSchema)