import User from '../models/User.js';

export const syncUser = async (req, res) => {
  const { userId, sessionClaims } = req.auth;

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    user = await User.create({
      clerkId: userId,
      email: sessionClaims.email,
      name: sessionClaims.name
    });
  }

  res.json(user);
};