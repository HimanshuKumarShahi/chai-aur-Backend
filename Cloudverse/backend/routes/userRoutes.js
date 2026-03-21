import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { requireAuth } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();


// 🔹 1. Test Auth Route
router.get('/test-auth', ClerkExpressRequireAuth(), (req, res) => {
    res.status(200).json({
        message: "Auth working",
        userId: req.auth.userId
    });
});


// 🔹 2. Sync User (CREATE ONLY)
router.post('/sync', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        const clerkUserId = req.auth.userId;

        let user = await User.findOne({ clerkUserId });

        if (!user) {
            user = new User({
                clerkUserId,
                email,
                firstName,
                lastName,
                role: 'customer'
            });

            await user.save();
            console.log("User created");
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Sync error:", error);
        res.status(500).json({ message: "Sync error" });
    }
});


// 🔹 3. GET CURRENT USER (🔥 IMPORTANT FIX)
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkUserId: req.auth.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (err) {
        console.error("Me route error:", err);
        res.status(500).json({ message: "Error fetching user" });
    }
});


export default router;