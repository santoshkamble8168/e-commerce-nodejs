const Product = require("../models/productModel")
const ErrorHander = require("../utils/errorHandler")
const handleAsyncErrors = require("../middlewares/handleAsyncErrors")
const HandleQueries = require("../utils/handleQueries")

//Create new product
exports.createProduct = handleAsyncErrors(async (req, res, next) => {
    req.body.createdBy = req.user.id //loggedin user set as created by

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        item: product
    })
}) 

//get all products
exports.getAllProducts = handleAsyncErrors(async (req, res,next) => {
    const recordsPerPage = req.query.pageLimit ? req.query.pageLimit : 10
    const productCount = await Product.countDocuments()
    const handle_queries = new HandleQueries(Product.find(), req.query).search().filter().pagination(recordsPerPage)
    
    const products = await handle_queries.query
    res.status(200).json({
        success: true,
        item: products,
        count: productCount,
        perPage: recordsPerPage
    })
})

//get single product/ product details
exports.getProductDetails = handleAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHander("product not found", 404))
    }

    res.status(200).json({
        success: true,
        item: product
    })
}) 

//update product
exports.updateProduct = handleAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHander("product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        item: product
    })
}) 

//delete product
exports.deleteProduct =handleAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    
    if (!product) {
        return next(new ErrorHander("product not found", 404))
    }

    await product.remove()
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    })
}) 