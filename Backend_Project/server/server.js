// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

import { protect } from "./middleware/authmiddleware.js";

dotenv.config();

const app = express();

// Allowed origins (frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://bankingsystem-seven.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.send("Server is Running 👍🏼"));
app.get("/api/health", (req, res) => res.json({ ok: true, message: "Backend health OK" }));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// Private test route
app.get("/api/private", protect, (req, res) => {
  res.json({ message: "Private route working", user: req.user });
});

// Catch-all 404 (fix for PathError)
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
