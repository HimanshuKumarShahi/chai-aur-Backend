import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import sendEmail from "../config/email.js";


// Register user (POST/api/auth/register)
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password
        });

        // Send Thank You Email
        await sendEmail({
            email: user.email,
            subject: "Welcome to LMS App 🎓",
            html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

      <h2 style="color: #2c3e50; text-align: center;">Welcome to LMS App</h2>

      <p style="font-size: 16px; color: #555;">
        Hello <strong>${user.name}</strong>,
      </p>

      <p style="font-size: 16px; color: #555;">
        Your account has been successfully created. We're excited to have you join our learning community.
      </p>

      <p style="font-size: 16px; color: #555;">
        You can now:
      </p>

      <ul style="font-size: 16px; color: #555;">
        <li>Access your dashboard</li>
        <li>Enroll in courses</li>
        <li>Track your progress</li>
        <li>Upgrade your skills</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/login"
           style="background-color: #3498db; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
           Login Now
        </a>
      </div>

      <p style="font-size: 14px; color: #888;">
        If you did not create this account, please contact support immediately.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} LMS App. All rights reserved.
      </p>

    </div>
  </div>
  `
        });

        res.status(201).json({
            success: true,
            message: "Registration successful. Welcome email sent."
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
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
                message: "Email and password required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
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