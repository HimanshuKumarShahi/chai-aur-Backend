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

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://bankingsystem-seven.vercel.app",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health
app.get("/", (req, res) => res.send("Server is running 👍"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// Private test
app.get("/api/private", protect, (req, res) => {
  res.json({ message: "Private route working", user: req.user });
});

// ✅ Correct 404 fallback (must be last)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() =>
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`✅ Server running on PORT ${PORT}`)
    )
  )
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
