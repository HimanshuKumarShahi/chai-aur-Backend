export const protect = (req, res, next) => {
  const user = req.headers["x-user-id"];
  if (!user) return res.status(401).json({ msg: "Unauthorized" });
  req.user = user;
  next();
};