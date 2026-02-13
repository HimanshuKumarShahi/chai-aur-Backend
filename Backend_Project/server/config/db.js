import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    isConnected = db.connections[0].readyState;
    console.log("✅ New MongoDB Connection Established");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

export default connectDB;