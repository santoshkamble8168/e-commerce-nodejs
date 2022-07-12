const app = require("./app")
const dotenv = require('dotenv');
const envFound = dotenv.config();
const connectDatabase = require("./config/database")

//handle uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to uncaught Exception`)
    process.exit(1)
})

if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const PORT = process.env.PORT
const appServer = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
    connectDatabase() //connect database
})

//unhandled Promise Rejection handling
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to unhandled Promise Rejection`)
    appServer.close(() => {
        process.exit(1)
    })  
})