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


app.get("/api/info", (req, res) => {
  res.json({
    app: "Express Practice API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    node: process.version,
    endpoints: [
      "/api/health",
      "/api/info",
      "/api/users",
      "/api/random",
      "/api/quote",
      "/api/image",
    ],
  });
});


app.get("/api/users", (req, res) => {
  const users = [
    {
      id: 1,
      name: "Himanshu",
      role: "Developer",
    },
    {
      id: 2,
      name: "Rahul",
      role: "Designer",
    },
    {
      id: 3,
      name: "Aman",
      role: "Backend Developer",
    },
  ];

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

app.get("/api/users/:id", (req, res) => {
  const users = [
    {
      id: 1,
      name: "Himanshu",
      role: "Developer",
    },
    {
      id: 2,
      name: "Rahul",
      role: "Designer",
    },
    {
      id: 3,
      name: "Aman",
      role: "Backend Developer",
    },
  ];

  const user = users.find(
    (user) => user.id === Number(req.params.id)
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
});


app.get("/api/search", (req, res) => {
  const name = req.query.name || "";

  res.json({
    success: true,
    query: name,
    message: `You searched for "${name}"`,
  });
});


app.get("/api/random", (req, res) => {
  const number = Math.floor(Math.random() * 100) + 1;

  res.json({
    success: true,
    number,
  });
});


app.get("/api/quote", (req, res) => {
  const quotes = [
    {
      quote: "First make it work. Then make it better.",
      author: "Developer principle",
    },
    {
      quote: "Simple code is easier to maintain.",
      author: "Engineering principle",
    },
    {
      quote: "Programs must be written for people to read.",
      author: "Harold Abelson",
    },
  ];

  const quote =
    quotes[Math.floor(Math.random() * quotes.length)];

  res.json({
    success: true,
    data: quote,
  });
});


app.get("/api/image", (req, res) => {
  const images = [
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
  ];

  const image =
    images[Math.floor(Math.random() * images.length)];

  res.json({
    success: true,
    image,
  });
});


app.get("/api/random-user", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.freeapi.app/api/v1/public/randomusers"
    );

    if (!response.ok) {
      throw new Error(
        `FreeAPI returned ${response.status}`
      );
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



app.get("/api/joke", async (req, res) => {
  try {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );

    if (!response.ok) {
      throw new Error("Joke API failed");
    }

    const joke = await response.json();

    res.json({
      success: true,
      data: joke,
    });
  } catch (error) {
    console.error(error);

    res.status(502).json({
      success: false,
      message: "Unable to fetch joke",
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
  console.log(
    `Server running: http://localhost:${PORT}`
  );
});