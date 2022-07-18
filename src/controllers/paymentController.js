const ErrorHander = require("../utils/errorHandler")
const handleAsyncErrors = require("../middlewares/handleAsyncErrors")
const stripe = require("stripe")(process.env.STRIPE_PRIVATE)

exports.processPayment = handleAsyncErrors(async(req, res, next) => {
    const makePayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency:"inr",
        metadata:{
            company: "Ecommence"
        }
    })

    res.status(200).json({
        success: true,
        client_secret: makePayment.client_secret
    })
})

exports.getStripePublicKey = handleAsyncErrors(async(req, res, next) => {
    res.status(200).json({
        success: true,
        item: process.env.STRIPE_PUBLIC
    })
})

