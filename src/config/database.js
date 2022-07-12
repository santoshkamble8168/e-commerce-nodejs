const mongoose = require("mongoose")


const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true}).then((data) => {
        console.log(`Database connectd with server: ${data.connection.host}`)
    })
}

module.exports = connectDatabase