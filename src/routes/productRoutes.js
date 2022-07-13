const router = require("express").Router()
const { createProduct, updateProduct, deleteProduct, getProductDetails, getAllProducts } = require("../controllers/productController")
const { isAuthRequired, isAuthorised } = require("../middlewares/auth")

router.route("/products").get(getAllProducts)
router.route("/product").post(isAuthRequired, isAuthorised("admin"), createProduct)
router.route("/product/:id").put(isAuthRequired, isAuthorised("admin"), updateProduct).delete(isAuthRequired, isAuthorised("admin"), deleteProduct).get(getProductDetails)

module.exports = router