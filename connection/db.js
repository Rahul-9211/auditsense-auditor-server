const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI_ADMIN_CLOUD, { useNewUrlParser: true , useUnifiedTopology: true })
    .then((res) => {
        console.log("mongo connected ", process.env.MONGO_URI_ADMIN_CLOUD);
    })
    .catch(error => {
        console.log("error-", error);
    });

// mongoose.Table = mongoose.createConnection(process.env.MONGO_URI_CUSTOMER, { useNewUrlParser: true })

module.exports = mongoose;