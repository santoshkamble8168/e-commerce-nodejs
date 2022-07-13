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
const userRouter = require("./routes/userRoutes")
app.use(baseRoute, productsRouter)
app.use(baseRoute, userRouter)


//middlewares
app.use(errorMiddleware)

module.exports = app