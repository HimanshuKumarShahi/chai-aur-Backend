import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from '../models/User.js'; // Make sure this points to your User model

const router = express.Router();

// 1. The test route
router.get('/test-auth', ClerkExpressRequireAuth(), (req, res) => {
    res.status(200).json({ 
        message: "Success! The backend verified your Clerk token.", 
        userId: req.auth.userId 
    });
});

// 2. The NEW Sync Route
router.post('/sync', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        const clerkUserId = req.auth.userId; // Securely verified by Clerk

        // Check if user already exists in MongoDB
        let user = await User.findOne({ clerkUserId });

        if (!user) {
            // Create them if they don't exist
            user = new User({
                clerkUserId,
                email,
                firstName,
                lastName,
                role: 'customer' // Everyone starts as a customer
            });
            await user.save();
            console.log("New user saved to MongoDB:");
        } else {
            console.log("User already exists in MongoDB:");
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ message: "Server error during sync" });
    }
});

export default router;