// routes/travel.js — updated to use cityService
const express     = require('express');
const router      = express.Router();
const { asyncHandler } = require('../middleware');
const cityService = require('../services/cityService');

const normalise = (str) => str?.toLowerCase().trim();

router.get('/:city', asyncHandler(async (req, res) => {
  const cityData = await cityService.getCityBySlug(normalise(req.params.city));
  if (!cityData) return res.status(404).json({ success: false, error: `City not found.` });
  res.json({ success: true, city: cityData.name, data: { routes: cityData.travel.from_cities, local_transport: cityData.travel.local_transport } });
}));

router.get('/:city/local', asyncHandler(async (req, res) => {
  const cityData = await cityService.getCityBySlug(normalise(req.params.city));
  if (!cityData) return res.status(404).json({ success: false, error: `City not found.` });
  res.json({ success: true, city: cityData.name, data: cityData.travel.local_transport });
}));

router.get('/:city/from/:origin', asyncHandler(async (req, res) => {
  const cityData = await cityService.getCityBySlug(normalise(req.params.city));
  if (!cityData) return res.status(404).json({ success: false, error: `City not found.` });
  const route = cityData.travel.from_cities.find(r => normalise(r.from) === normalise(req.params.origin));
  if (!route) return res.status(404).json({ success: false, error: `No route from "${req.params.origin}". Available: ${cityData.travel.from_cities.map(r=>r.from).join(', ')}` });
  res.json({ success: true, city: cityData.name, origin: route.from, data: route });
}));

module.exports = router;
