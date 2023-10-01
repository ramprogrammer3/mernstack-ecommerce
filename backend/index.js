const express = require("express");
require("dotenv").config();
const fileUploader = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connect = require("./config/db");

const port = process.env.port || 8080;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fileUploader({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// routes
app.use("/api/v1/user",require("./routes/userRoutes"));

app.get("/",(req,res)=>{
    return res.send("<h1>This is home page baby...!!</h1>")
})
// connect to mongodb compass
connect();


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})