const express = require("express")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const errorMiddleware = require("./middlewares/error")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))


//Routers
const baseRoute = "/api/v1/"
const productsRouter = require("./routes/productRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
app.use(baseRoute, authRoutes)
app.use(baseRoute, userRoutes)
app.use(baseRoute, productsRouter)
app.use(baseRoute, orderRoutes)
app.use(baseRoute, paymentRoutes)


//middlewares
app.use(errorMiddleware)

module.exports = app