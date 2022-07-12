const express = require("express")
const errorMiddleware = require("./middlewares/error")
const app = express()

app.use(express.json())

//Routers
const products = require("./routes/productRoutes")
app.use("/api/v1/", products)


//middlewares
app.use(errorMiddleware)

module.exports = app