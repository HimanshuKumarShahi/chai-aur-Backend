import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    const clerkId = req.headers["clerkid"]; 

    if (!clerkId) {
      return res.status(401).json("No clerkId provided");
    }

    const user = await User.findOne({ clerkId });

    if (!user || user.role !== "admin") {
      return res.status(403).json("Access denied");
    }

    next();
  } catch (err) {
    res.status(500).json(err.message);
  }
};