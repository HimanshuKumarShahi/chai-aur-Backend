import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';


export const requireAuth = ClerkExpressRequireAuth();


export const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const clerkUserId = req.auth.userId;

      const user = await User.findOne({ clerkUserId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user; // attach user to request
      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization error" });
    }
  };
};