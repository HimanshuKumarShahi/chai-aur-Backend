export const isAdmin = (req, res, next) => {
  if (req.auth.userId === process.env.ADMIN_CLERK_ID) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};