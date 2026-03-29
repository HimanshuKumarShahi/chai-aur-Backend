import User from "../models/User.js";

// 🔥 Protects Admin-only routes
export const isAdmin = async (req, res, next) => {
  try {
    const clerkId = req.headers["clerkid"] || req.headers["clerk-id"]; 
    if (!clerkId) return res.status(401).json({ message: "Unauthorized: No ID" });

    const user = await User.findOne({ clerkId });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isBlocked) return res.status(403).json({ message: "Account is blocked." });
    if (user.role !== "admin") return res.status(403).json({ message: "Admin required." });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 🔥 Protects regular routes from blocked users
export const checkBlocked = async (req, res, next) => {
  try {
    const clerkId = req.headers["clerkid"] || req.headers["clerk-id"] || req.params.clerkId;
    if (!clerkId) return res.status(401).json({ message: "Clerk ID missing" });

    const user = await User.findOne({ clerkId });
    if (user && user.isBlocked) {
      return res.status(403).json({ message: "Your access has been terminated. Action forbidden." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Security Check Failed" });
  }
};