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

// ✅ CORS (allow FRONTEND, not backend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://bankingsystem-seven.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / server-to-server
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Fix preflight
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Server is Running 👍🏼");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend health OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/api/private", protect, (req, res) => {
  res.json({ message: "Private route working", user: req.user });
});

// Start server (Render Fix)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on PORT ${PORT}`);
});

connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});
