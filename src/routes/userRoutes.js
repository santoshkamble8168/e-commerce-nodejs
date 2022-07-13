const router = require("express").Router()
const { getUserDetails, getProfile, registerUser, forgotPassword, resetPassword, updatePassword } = require("../controllers/userController")
const { isAuthRequired } = require("../middlewares/auth")

router.route("/register").post(registerUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").put(resetPassword)
router.route("/update-password").put(isAuthRequired, updatePassword)

router.route("/user/me").get(isAuthRequired, getProfile)
router.route("/user/:id").get(getUserDetails)

module.exports = router