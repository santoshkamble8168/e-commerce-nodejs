const router = require("express").Router()
const { loginUser, logoutUser} = require("../controllers/authController")

router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)

module.exports = router