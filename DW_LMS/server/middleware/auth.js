import User from "../models/User.js";

/**
 * Middleware to verify if the request comes from an Admin
 */
export const isAdmin = async (req, res, next) => {
  try {
    // Node.js automatically lowercases all header keys
    const clerkId = req.headers["clerkid"]; 

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

    // Role Check
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin privileges required." });
    }

    // Authorized - attach user object to request for further use
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};