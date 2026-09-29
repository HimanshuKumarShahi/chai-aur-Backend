import express from "express";

const app = express();

app.use("/api/health", (req, res) => {
  res.status(200).send("server is running bro !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: localhost:${PORT}/api/health`);
});
