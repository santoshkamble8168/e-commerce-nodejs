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

//create/update review
exports.productReview = handleAsyncErrors(async (req, res, next) => {
    const { rating, comment} = req.body
    const productid = req.params.id

    const newReview = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment
    }

    const product = await Product.findById(productid)

    if (!product) {
        return next(new ErrorHander("product not found", 404))
    }

    const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString()) //if the user is reviewed this product?

    if (isReviewed) { //if alredy reviewed then update it
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.rating = rating
                review.comment = comment
            }
        });
    }else{ //add new review
        product.reviews.push(newReview)
        product.numOfReviews = product.reviews.length
    }

    //avg rating
    const sumOfRating = product.reviews.reduce((previous, current) => previous + current.rating, 0);
    product.rating = sumOfRating / product.reviews.length

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
        message: `Review ${isReviewed ? "updated" : "added"} successfully`,
        item: product
    })
})

exports.getProductReviews = handleAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHander("product not found", 404))
    }

    res.status(200).json({
        success: true,
        item: product.reviews
    })
})

exports.deleteReview = handleAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHander("product not found", 404))
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.review_id.toString())
    const rating = getAvarageOfRatings(reviews)
    const noOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.params.id, {
        reviews,
        rating,
        noOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        item: reviews
    })
})


const getAvarageOfRatings = (reviews) => {
    const sumOfRating = reviews.reduce((previous, current) => previous + current.rating, 0);
    return sumOfRating / reviews.length
}