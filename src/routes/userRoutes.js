const router = require("express").Router()
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require("../controllers/authController")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").put(resetPassword)

module.exports = router