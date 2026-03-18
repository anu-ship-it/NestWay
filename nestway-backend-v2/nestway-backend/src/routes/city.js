// routes/city.js — updated to use cityService (DB or mock)
const express     = require('express');
const router      = express.Router();
const { asyncHandler } = require('../middleware');
const cityService = require('../services/cityService');

const normalise = (str) => str?.toLowerCase().trim();

// GET /api/city — list all cities
router.get('/', asyncHandler(async (req, res) => {
  const cities = await cityService.getAllCities();
  res.json({ success: true, count: cities.length, data: cities });
}));

// GET /api/city/:city?mode=student|tourist|all
router.get('/:city', asyncHandler(async (req, res) => {
  const slug = normalise(req.params.city);
  const mode = normalise(req.query.mode) || 'all';
  const cityData = await cityService.getCityBySlug(slug);

  if (!cityData) {
    const available = (await cityService.getAllCities()).map(c => c.id);
    return res.status(404).json({ success: false, error: `City "${slug}" not found.`, available_cities: available });
  }

  const base = {
    name: cityData.name, state: cityData.state,
    weather: cityData.weather,
    travel: { routes: cityData.travel.from_cities, local: cityData.travel.local_transport },
  };

  if (mode === 'student') return res.json({ success: true, mode, data: { ...base, pg_and_rent: cityData.pg_and_rent, food: cityData.food } });
  if (mode === 'tourist') return res.json({ success: true, mode, data: { ...base, hotels: cityData.hotels, food: cityData.food } });
  res.json({ success: true, mode: 'all', data: { ...base, hotels: cityData.hotels, pg_and_rent: cityData.pg_and_rent, food: cityData.food } });
}));

module.exports = router;
