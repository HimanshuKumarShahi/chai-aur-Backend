import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please Provide all the fields" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(422).json({ success: false, message: "User with this email already exists" });
        }
        const user = await User.create({
            name,
            email,
            password
        });

        const token=jwt.sign(
            { id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '7d',
        })
        
        res.cookie("token",token)
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Error in RegisterUser:", err);
        res.status(500).json({ success: false, message: "Server Error",err });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please Provide Email and Password." });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials."
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Login Error: ", err);
        res.status(500).json({ success: false, message: err.message });
    }

};