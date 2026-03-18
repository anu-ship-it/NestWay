// ─────────────────────────────────────────────────────────────
//  routes/weather.js
//  GET /api/weather/:city
//
//  Returns current weather + best months to visit.
//  Uses mock data by default. Set USE_MOCK_DATA=false in .env
//  and add your OPENWEATHER_API_KEY to use the real API.
// ─────────────────────────────────────────────────────────────

const express = require("express");
const axios = require("axios");
const router = express.Router();
const mockData = require("../data/mockData");
const { asyncHandler } = require("../middleware");

// Helper: normalise city name for mock data lookup ("Chandigarh" → "chandigarh")
const normalise = (city) => city.toLowerCase().trim();

// ── GET /api/weather/:city ───────────────────────────────────
router.get("/:city", asyncHandler(async (req, res) => {
  const city = normalise(req.params.city);

  // ── MOCK PATH ──────────────────────────────────────────────
  if (process.env.USE_MOCK_DATA === "true" || !process.env.OPENWEATHER_API_KEY) {
    const cityData = mockData[city];
    if (!cityData) {
      return res.status(404).json({ success: false, error: `City "${city}" not found in mock data. Add it to mockData.js.` });
    }
    return res.json({ success: true, source: "mock", data: cityData.weather });
  }

  // ── REAL API PATH ──────────────────────────────────────────
  // Docs: https://openweathermap.org/current
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
  const response = await axios.get(url);
  const d = response.data;

  // Shape the real API response to match NestWay's format
  const weatherData = {
    current: {
      temp_c: Math.round(d.main.temp),
      condition: d.weather[0].description,
      humidity: d.main.humidity,
      wind_kph: Math.round(d.wind.speed * 3.6), // m/s → km/h
    },
    // Best months logic: pull from mock data even with real API
    // (OpenWeather doesn't provide seasonal advice)
    best_months_to_visit: mockData[city]?.weather?.best_months_to_visit || [],
    avoid_months: mockData[city]?.weather?.avoid_months || [],
    tip: mockData[city]?.weather?.tip || "",
  };

  res.json({ success: true, source: "openweathermap", data: weatherData });
}));

module.exports = router;
