// ─────────────────────────────────────────────────────────────
//  routes/stay.js
//
//  GET /api/stay/:city/hotels            → all hotels
//  GET /api/stay/:city/hotels?type=budget → filter by type
//  GET /api/stay/:city/pg                → all PG listings
//  GET /api/stay/:city/pg?gender=girls   → filter by gender
//  GET /api/stay/:city/budget            → student monthly budget summary
// ─────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const mockData = require("../data/mockData");
const { asyncHandler } = require("../middleware");

const normalise = (str) => str?.toLowerCase().trim();

// ── GET /api/stay/:city/hotels ───────────────────────────────
router.get("/:city/hotels", asyncHandler(async (req, res) => {
  const city = normalise(req.params.city);
  const cityData = mockData[city];

  if (!cityData) {
    return res.status(404).json({ success: false, error: `City "${city}" not found.` });
  }

  let hotels = cityData.hotels;

  // Optional filter: ?type=budget | mid-range | luxury | hostel
  if (req.query.type) {
    hotels = hotels.filter(
      (h) => normalise(h.type) === normalise(req.query.type)
    );
  }

  // Optional filter: ?stars=3
  if (req.query.stars) {
    hotels = hotels.filter((h) => h.stars === parseInt(req.query.stars));
  }

  res.json({
    success: true,
    city: cityData.name,
    count: hotels.length,
    filters_applied: req.query,
    data: hotels,
  });
}));

// ── GET /api/stay/:city/pg ───────────────────────────────────
router.get("/:city/pg", asyncHandler(async (req, res) => {
  const city = normalise(req.params.city);
  const cityData = mockData[city];

  if (!cityData) {
    return res.status(404).json({ success: false, error: `City "${city}" not found.` });
  }

  let listings = cityData.pg_and_rent.pg_listings;

  // Optional filter: ?gender=girls | boys | any
  if (req.query.gender) {
    listings = listings.filter(
      (p) => normalise(p.gender) === normalise(req.query.gender)
    );
  }

  // Optional filter: ?verified=true
  if (req.query.verified === "true") {
    listings = listings.filter((p) => p.verified === true);
  }

  // Optional filter: ?area=sector 14
  if (req.query.area) {
    listings = listings.filter(
      (p) => normalise(p.area).includes(normalise(req.query.area))
    );
  }

  res.json({
    success: true,
    city: cityData.name,
    count: listings.length,
    popular_areas: cityData.pg_and_rent.popular_student_areas,
    tips: cityData.pg_and_rent.tips,
    filters_applied: req.query,
    data: listings,
  });
}));

// ── GET /api/stay/:city/budget ───────────────────────────────
// Returns the student monthly cost breakdown
router.get("/:city/budget", asyncHandler(async (req, res) => {
  const city = normalise(req.params.city);
  const cityData = mockData[city];

  if (!cityData) {
    return res.status(404).json({ success: false, error: `City "${city}" not found.` });
  }

  res.json({
    success: true,
    city: cityData.name,
    data: {
      monthly_budget: cityData.pg_and_rent.avg_monthly_budget_student,
      food: cityData.food,
    },
  });
}));

module.exports = router;
