const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const projectRoutes = require("./routes/projectRoutes");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const activityRoutes = require("./routes/activityRoutes");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/*
  LIVE TESTING CORS SETUP
  Add your frontend URLs in Render environment variable:
  CLIENT_URLS=https://your-site.vercel.app,https://rkndevl.great-site.net,http://localhost:5173
*/
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS
    ? process.env.CLIENT_URLS.split(",").map((url) => url.trim())
    : []),
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate API Running...",
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/activities", activityRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  console.log("Server error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this request",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request data is too large",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});