const router = require("express").Router()
const { createOrder, getOrderDetails, getMyOrders, getOrders, updateOrderStatus, deleteOrder, getMyOrderDetails } = require("../controllers/orderController")
const { isAuthRequired, isAuthorised } = require("../middlewares/auth")


router.route("/order").post(isAuthRequired, createOrder)
router.route("/orders/me").get(isAuthRequired, getMyOrders)
router.route("/orders/me/:id").get(isAuthRequired, getMyOrderDetails)

router.route("/admin/order/:id").get(isAuthRequired, isAuthorised("admin"), getOrderDetails)
router.route("/admin/orders").get(isAuthRequired, isAuthorised("admin"), getOrders)
router.route("/admin/order/:id")
    .put(isAuthRequired, isAuthorised("admin"), updateOrderStatus)
    .delete(isAuthRequired, isAuthorised("admin"), deleteOrder)

module.exports = router