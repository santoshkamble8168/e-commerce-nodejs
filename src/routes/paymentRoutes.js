const router = require("express").Router()
const { processPayment, getStripePublicKey } = require("../controllers/paymentController")
const { isAuthRequired, isAuthorised } = require("../middlewares/auth")

router.route("/payment/process").post(isAuthRequired, processPayment)
router.route("/payment/stipepublickey").get(isAuthRequired, getStripePublicKey)

module.exports = router