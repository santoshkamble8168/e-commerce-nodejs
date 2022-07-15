const mongoose = require("mongoose")
const User = require("./userModel")
const Product = require("./productModel")

const orderSchema = mongoose.Schema({
    shipping: {
        address: {
            type: String,
            required: [true, "Please enter address"]
        },
        city: {
            type: String,
            required: [true, "Please enter city"]
        },
        state: {
            type: String,
            required: [true, "Please enter state"]
        },
        country: {
            type: String,
            required: [true, "Please enter country"]
        },
        zipcode: {
            type: Number,
            required: [true, "Please enter zipcode"],
            maxLength: [6, "zipcode max length is 6 characters"]
        },
        phone: {
            type: String,
            required: [true, "Please enter phone number"]
        },
    },
    order:[
        {
            name: {
                type: String,
                required: [true, "Please enter name"]
            },
            price: {
                type: Number,
                required: [true, "Please enter price"]
            },
            quantity: {
                type: Number,
                required: [true, "Please enter quantity"]
            },
            image: {
                type: String,
                required: [true, "Please provide image"]
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    payment: {
        id:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        }
    },
    paidAt:{
        type: Date,
        required: true
    },
    itemsPrice:{
        type: Number,
        required: true
    },
    taxPrice:{
        type: Number,
        required: true
    },
    shippingPrice:{
        type: Number,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("Order", orderSchema)