const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.url;

const connect = () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("DB Connection Successful");
    }).catch(() => {
        console.log("DB connecton Failed");
        process.exit(1);
    })
}

module.exports = connect;