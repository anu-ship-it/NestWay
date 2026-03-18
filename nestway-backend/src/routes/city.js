// ─────────────────────────────────────────────────────────────
//  routes/city.js
//
//  GET /api/city                   → list all available cities
//  GET /api/city/:city             → full city summary (all data)
//  GET /api/city/:city?mode=student  → student-focused summary
//  GET /api/city/:city?mode=tourist  → tourist-focused summary
//
//  This is the MAIN route the frontend will use.
//  One call → everything the results page needs.
// ─────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const mockData = require("../data/mockData");
const { asyncHandler } = require("../middleware");

const normalise = (str) => str?.toLowerCase().trim();

// ── GET /api/city ────────────────────────────────────────────
// Returns list of all available cities
router.get("/", asyncHandler(async (req, res) => {
  const cities = Object.keys(mockData).map((key) => ({
    id: key,
    name: mockData[key].name,
    state: mockData[key].state,
  }));

  res.json({ success: true, count: cities.length, data: cities });
}));

// ── GET /api/city/:city ──────────────────────────────────────
// Master summary endpoint — used by the Results page
router.get("/:city", asyncHandler(async (req, res) => {
  const city = normalise(req.params.city);
  const mode = normalise(req.query.mode) || "all"; // "student" | "tourist" | "all"
  const cityData = mockData[city];

  if (!cityData) {
    return res.status(404).json({
      success: false,
      error: `City "${city}" not found.`,
      available_cities: Object.keys(mockData),
    });
  }

  // Build base response (common to all modes)
  const base = {
    name: cityData.name,
    state: cityData.state,
    weather: cityData.weather,
    travel: {
      routes: cityData.travel.from_cities,
      local: cityData.travel.local_transport,
    },
  };

  // Student mode: PG listings + budget breakdown
  if (mode === "student") {
    return res.json({
      success: true,
      mode: "student",
      data: {
        ...base,
        pg_and_rent: cityData.pg_and_rent,
        food: cityData.food,
      },
    });
  }

  // Tourist mode: hotels only
  if (mode === "tourist") {
    return res.json({
      success: true,
      mode: "tourist",
      data: {
        ...base,
        hotels: cityData.hotels,
        food: cityData.food,
      },
    });
  }

  // Default: return everything
  res.json({
    success: true,
    mode: "all",
    data: {
      ...base,
      hotels: cityData.hotels,
      pg_and_rent: cityData.pg_and_rent,
      food: cityData.food,
    },
  });
}));

module.exports = router;
