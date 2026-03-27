import User from '../models/User.js';

export const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    // Read the data sent from the React Native frontend body
    const { name, email, image } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No Clerk ID found" });
    }

    // Check if the user already exists in MongoDB
    let user = await User.findOne({ clerkId: userId });

    // If they don't exist, create a new record
    if (!user) {
      user = await User.create({
        clerkId: userId,
        email: email || 'No email provided',
        name: name || 'Student',
        image: image || ''
      });
    }

    // Return the MongoDB user document back to the frontend
    res.status(200).json(user);

  } catch (error) {
    console.error("Sync User Error:", error);
    res.status(500).json({ message: error.message });
  }
};