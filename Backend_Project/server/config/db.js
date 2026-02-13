import mongoose from "mongoose";
let isConnected = false;

const connectDB = async () => {
 
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

 
  mongoose.set("bufferCommands", false); 

  try {
    console.log("=> Establishing new MongoDB connection...");
    
    const db = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,         
      family: 4                       
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ New MongoDB Connection Established");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    throw new Error("Database connection failed");
  }
};

export default connectDB;