// ─────────────────────────────────────────────────────────────
//  routes/travel.js
//
//  GET /api/travel/:city              → all travel options TO city
//  GET /api/travel/:city/from/:origin → options from a specific city
//  GET /api/travel/:city/local        → local transport inside city
// ─────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const mockData = require("../data/mockData");
const { asyncHandler } = require("../middleware");

const normalise = (str) => str.toLowerCase().trim();

// ── GET /api/travel/:city ────────────────────────────────────
// Returns all "from_cities" travel options + local transport
router.get("/:city", asyncHandler(async (req, res) => {
  const city = normalise(req.params.city);
  const cityData = mockData[city];

  if (!cityData) {
    return res.status(404).json({ success: false, error: `City "${city}" not found.` });
  }

  res.json({
    success: true,
    city: cityData.name,
    data: {
      routes: cityData.travel.from_cities,
      local_transport: cityData.travel.local_transport,
    },
  });
}));

// ── GET /api/travel/:city/local ──────────────────────────────
// Returns only local transport options within the city
router.get("/:city/local", asyncHandler(async (req, res) => {
  const city = normalise(req.params.city);
  const cityData = mockData[city];

  if (!cityData) {
    return res.status(404).json({ success: false, error: `City "${city}" not found.` });
  }

  res.json({
    success: true,
    city: cityData.name,
    data: cityData.travel.local_transport,
  });
}));

// ── GET /api/travel/:city/from/:origin ───────────────────────
// Returns travel options from a specific origin city
// Example: /api/travel/chandigarh/from/delhi
router.get("/:city/from/:origin", asyncHandler(async (req, res) => {
  const city   = normalise(req.params.city);
  const origin = normalise(req.params.origin);
  const cityData = mockData[city];

  if (!cityData) {
    return res.status(404).json({ success: false, error: `City "${city}" not found.` });
  }

  // Find the matching origin route (case-insensitive)
  const route = cityData.travel.from_cities.find(
    (r) => normalise(r.from) === origin
  );

  if (!route) {
    return res.status(404).json({
      success: false,
      error: `No routes found from "${origin}" to "${city}". Available origins: ${cityData.travel.from_cities.map((r) => r.from).join(", ")}`,
    });
  }

  res.json({ success: true, city: cityData.name, origin: route.from, data: route });
}));

module.exports = router;
