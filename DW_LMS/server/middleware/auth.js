import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    // Check header, query, or body for the clerkId
    const clerkId = req.headers["clerkid"] || req.headers["clerk-id"]; 

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized: No Clerk ID provided." });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found in database." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Access denied: Account is blocked." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};