import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  // Stop mongoose from waiting indefinitely if the connection is down
  mongoose.set("bufferCommands", false);

  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
      family: 4 // Use IPv4 for faster DNS lookup in cloud envs
    });
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Connection Error:", error.message);
    throw error; // Throw so the controller catches it
  }
};

export default connectDB;