import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import sendEmail from "../config/email.js";
import crypto from "crypto";


// Register user (POST/api/auth/register)
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            isVerified: false
        });

        const rawToken = crypto.randomBytes(32).toString("hex");

        user.verificationToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        user.verificationTokenExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Direct backend verification link
        const verifyURL = `http://localhost:5000/api/auth/verify/${rawToken}`;

        await sendEmail({
            email: user.email,
            subject: "Verify Your Email",
            message: `Click this link to verify your email:\n\n${verifyURL}`
        });

        res.status(201).json({
            success: true,
            message: "Registered. Please check your email to verify."
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            verificationToken: hashedToken
        });

        // 1️⃣ Token not found
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification link"
            });
        }

        // 2️⃣ Already verified
        if (user.isVerified) {
            return res.status(200).json({
                success: true,
                message: "Email already verified"
            });
        }

        // 3️⃣ Token expired
        if (user.verificationTokenExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Verification link expired"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Login user (POST/api/auth/login)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password."
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        // 1️⃣ Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 2️⃣ Check email verification
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email before logging in."
            });
        }

        // 3️⃣ Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 4️⃣ Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || "7d" }
        );

        // 5️⃣ Send secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 6️⃣ Return user data only (REMOVE token from JSON)
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



export const logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const Dashboard = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
}