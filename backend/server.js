const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://deepkalrity-assignment-frontend.vercel.app"
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/resumes", resumeRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Resume Analyzer API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "File too large",
      details: "Maximum file size is 10MB",
    });
  }

  if (error.message === "Only PDF files are allowed") {
    return res.status(400).json({
      error: "Invalid file type",
      details: "Only PDF files are allowed",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    details:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Resume Analyzer API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Upload endpoint: http://localhost:${PORT}/api/resumes/upload`);
});

module.exports = app;
