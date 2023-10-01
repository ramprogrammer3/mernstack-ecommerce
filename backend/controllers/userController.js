const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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