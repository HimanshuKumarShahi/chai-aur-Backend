import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { requireAuth } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// 🔹 Sync User (Update if exists, Create if not)
router.post('/sync', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        const clerkUserId = req.auth.userId;

        const user = await User.findOneAndUpdate(
            { clerkUserId },
            { email, firstName, lastName },
            { returnDocument: 'after', upsert: true } // Create if doesn't exist
        );

        res.status(200).json(user);
    } catch (error) {
        console.error("Sync error:", error);
        res.status(500).json({ message: "Sync error" });
    }
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkUserId: req.auth.userId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

export default router;