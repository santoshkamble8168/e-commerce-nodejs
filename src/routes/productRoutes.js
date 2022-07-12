const router = require("express").Router()
const { createProduct, updateProduct, deleteProduct, getProductDetails, getAllProducts } = require("../controllers/productController")

router.route("/products").get(getAllProducts)
router.route("/product").post(createProduct)
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails)

module.exports = router