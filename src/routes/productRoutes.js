const router = require("express").Router()
const { createProduct, updateProduct, deleteProduct, getProductDetails, getAllProducts, productReview, getProductReviews, deleteReview } = require("../controllers/productController")
const { isAuthRequired, isAuthorised } = require("../middlewares/auth")

router.route("/products")
    .get(getAllProducts)

    router.route("/product/:id")
    .get(getProductDetails)

//admin routes
router.route("/admin/product")
    .post(isAuthRequired, isAuthorised("admin"), createProduct)

router.route("/admin/product/:id")
    .put(isAuthRequired, isAuthorised("admin"), updateProduct)
    .delete(isAuthRequired, isAuthorised("admin"), deleteProduct)

router.route("/review/product/:id")
    .put(isAuthRequired, productReview)
    .delete(isAuthRequired, deleteReview)
    .get(getProductReviews)

module.exports = router