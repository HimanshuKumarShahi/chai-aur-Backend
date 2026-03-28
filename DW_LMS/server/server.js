import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
// import assignmentRoutes from "./routes/assignment.routes.js";
import downloadRoutes from "./routes/download.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*", // In production, replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "clerkid", "Authorization"]
}));
app.use(express.json());


app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
// app.use("/api/assignment", assignmentRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB connection error : ",err));

app.get("/", (req, res) => {
  res.send("DW LMS API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));