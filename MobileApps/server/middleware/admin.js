export const requireAdmin = (req, res, next) => {
  const adminId = process.env.ADMIN_CLERK_ID;

  if (!req.auth || req.auth.userId !== adminId) {
    return res.status(403).json({ message: "Admin only access" });
  }

  next();
};