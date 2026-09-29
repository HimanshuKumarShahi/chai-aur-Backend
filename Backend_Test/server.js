import express from "express";

const app = express();

app.use("/api/health", (req, res) => {
  res.status(200).send("Server is running.");
});

app.use('/api/data', async (req, res, next) => {
  try {
    const response = await fetch('https://api.freeapi.app/api/v1/public/randomusers');
    if (!response.ok) {
      throw new Error('HTTP error occurred');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/api/health`);
});
