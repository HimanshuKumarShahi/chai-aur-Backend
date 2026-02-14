import mongoose from "mongoose";

const connectDB = async () => {
  // If already connected, don't re-connect
  if (mongoose.connection.readyState >= 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of 30s
    });
    console.log("✅ MongoDB Connected");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error; // DON'T use process.exit(1) on Vercel!
  }
};

export default connectDB;