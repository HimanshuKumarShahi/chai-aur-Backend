import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running.",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/image", (req, res) => {
  const images = [
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
  ];

  const image = images[Math.floor(Math.random() * images.length)];

  res.json({
    success: true,
    image,
  });
});

app.get("/api/random-user", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.freeapi.app/api/v1/public/randomusers",
    );

    if (!response.ok) {
      throw new Error(`FreeAPI returned ${response.status}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(502).json({
      success: false,
      message: "Unable to fetch random user",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
