const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const ErrorHander = require("../utils/errorHandler")
const handleAsyncErrors = require("../middlewares/handleAsyncErrors")

//create new order
exports.createOrder = handleAsyncErrors(async(req, res, next) => {
    const {shipping, order, payment, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body

    const newOrder = await Order.create({
        shipping, 
        order, 
        payment, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        message: "New order placed successfully",
        item: newOrder
    })
})

//get all orders - Admin
exports.getOrders = handleAsyncErrors(async(req, res, next) => {
    const orders = await Order.find().populate("user", "name email")

    let totlaAmount = orders.reduce((amount, current) => amount + current.totalPrice, 0)

    res.status(201).json({
        success: true,
        item: orders,
        totlaAmount
    })
})

//get all order details - Admin
exports.getOrderDetails = handleAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email").populate("order.product", "name images")

    if(!order){
        return next(new ErrorHander("Order not found", 404))
    }

    res.status(201).json({
        success: true,
        item: order
    })
})

//update order status - Admin
exports.updateOrderStatus = handleAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHander("Order not found", 404))
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHander("Order is alredy delivered", 400))
    }

    order.order.forEach(async(order_detail) => {
        await updateStock(order_detail.product, order_detail.quantity)
    });

    order.orderStatus = req.body.status
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave: false})

    res.status(201).json({
        success: true,
        message: "Order status updated succesfully",
        item: order
    })
})

//delete order - Admin
exports.deleteOrder = handleAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHander("Order not found", 404))
    }

    await order.remove()

    res.status(201).json({
        success: true,
        message: "Order deleted succesfuly"
    })
})

exports.getMyOrders = handleAsyncErrors(async(req, res, next) => {
    console.log(req.user)
    const orders = await Order.find({user: req.user._id})

    if(!orders){
        return next(new ErrorHander("Order not found", 404))
    }

    res.status(201).json({
        success: true,
        item: orders
    })
})

//get all order details - Admin
exports.getMyOrderDetails = handleAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHander("Order not found", 404))
    }

    res.status(201).json({
        success: true,
        item: order
    })
})

async function updateStock(id, quantity){
    const product = await Product.findById(id)

    product.stock -= quantity

    await product.save({validateBeforeSave: false})
}