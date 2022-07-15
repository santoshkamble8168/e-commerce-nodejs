const router = require("express").Router()
const { getUserDetails, getProfile, registerUser, forgotPassword, resetPassword, updatePassword, updateProfile, getAllUsers, updateUser, deleteUser } = require("../controllers/userController")
const { isAuthRequired, isAuthorised } = require("../middlewares/auth")

router.route("/register").post(registerUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").put(resetPassword)
router.route("/update-password").put(isAuthRequired, updatePassword)

router.route("/profile/me")
    .get(isAuthRequired, getProfile)
    .put(isAuthRequired, updateProfile)

//admin routes
router.route("/admin/user").get(isAuthRequired, isAuthorised("admin"), getAllUsers)
router.route("/admin/user/:id").get(isAuthRequired, isAuthorised("admin"), getUserDetails)
    
.get(isAuthRequired, isAuthorised("admin"),getUserDetails)
    .put(isAuthRequired, isAuthorised("admin"), updateUser)
    .delete(isAuthRequired, isAuthorised("admin"), deleteUser)

module.exports = router