// ─────────────────────────────────────────────────────────────
//  src/index.js  —  NestWay Backend Entry Point
//
//  Run with:  npm run dev
//  Production: npm start
// ─────────────────────────────────────────────────────────────

require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const { requestLogger, errorHandler } = require("./middleware");

// ── Import routes ────────────────────────────────────────────
const cityRoutes    = require("./routes/city");
const weatherRoutes = require("./routes/weather");
const travelRoutes  = require("./routes/travel");
const stayRoutes    = require("./routes/stay");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global middleware ────────────────────────────────────────
app.use(cors());               // Allow React frontend (localhost:3000) to call this
app.use(express.json());       // Parse JSON request bodies
app.use(requestLogger);        // Log every request to console

// ── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    app: "NestWay API",
    version: "1.0.0",
    status: "running",
    mock_mode: process.env.USE_MOCK_DATA === "true",
    endpoints: {
      cities:  "GET /api/city",
      city:    "GET /api/city/:city?mode=student|tourist",
      weather: "GET /api/weather/:city",
      travel:  "GET /api/travel/:city",
      stay:    "GET /api/stay/:city/hotels | /pg | /budget",
    },
  });
});

// ── Mount routes ─────────────────────────────────────────────
app.use("/api/city",    cityRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/travel",  travelRoutes);
app.use("/api/stay",    stayRoutes);

// ── 404 handler (must come after all routes) ─────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Global error handler ─────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   NestWay API is running             ║
  ║   http://localhost:${PORT}              ║
  ║   Mock mode: ${process.env.USE_MOCK_DATA === "true" ? "ON  ✓" : "OFF (real APIs)"}             ║
  ╚══════════════════════════════════════╝
  `);
});
