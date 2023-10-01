const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
    try {
        // fetch data from  request ki body
        const { name, email, password } = req.body;

        // validate data
        if (!name || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required,please fill and try again"
            })
        }

        // validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "password length is less than 6 character"
            })
        }

        // check user
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User is already register"
            })
        }

        // hash password

        const hashPassword = await bcrypt.hash(password, 10);

        // create a user
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        })

        // return response
        return res.status(200).json({
            success: true,
            message: "User register successfully",
            data: newUser,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to register, please try again"
        })
    }
}


exports.login = async (req, res) => {
    try {

        // get data from req body
        const { email, password } = req.body;

        // validate data 
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required,"
            })
        }

        // check user exist or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not register, please signup first",
            })
        }

        // compare password
        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "30d"
            })

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            })

        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed , please try again"
        })
    }
}