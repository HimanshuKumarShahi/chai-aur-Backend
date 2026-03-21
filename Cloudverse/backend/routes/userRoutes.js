import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();

// This route is protected. Only logged-in users with a valid token can access it.
router.get('/test-auth', ClerkExpressRequireAuth(), (req, res) => {
    res.status(200).json({ 
        message: "Success! The backend verified your Clerk token.", 
        userId: req.auth.userId 
    });
});

export default router;