// routes/stay.js — updated to use cityService
const express     = require('express');
const router      = express.Router();
const { asyncHandler } = require('../middleware');
const cityService = require('../services/cityService');
const { isDBConnected } = require('../config/db');
const cityServiceModule  = require('../services/cityService');

const normalise = (str) => str?.toLowerCase().trim();

router.get('/:city/hotels', asyncHandler(async (req, res) => {
  const cityData = await cityService.getCityBySlug(normalise(req.params.city));
  if (!cityData) return res.status(404).json({ success: false, error: 'City not found.' });
  let hotels = cityData.hotels || [];
  if (req.query.type)  hotels = hotels.filter(h => normalise(h.type)  === normalise(req.query.type));
  if (req.query.stars) hotels = hotels.filter(h => h.stars === parseInt(req.query.stars));
  res.json({ success: true, city: cityData.name, count: hotels.length, filters_applied: req.query, data: hotels });
}));

router.get('/:city/pg', asyncHandler(async (req, res) => {
  const cityData = await cityService.getCityBySlug(normalise(req.params.city));
  if (!cityData) return res.status(404).json({ success: false, error: 'City not found.' });
  let listings = cityData.pg_and_rent?.pg_listings || [];
  if (req.query.gender)   listings = listings.filter(p => normalise(p.gender) === normalise(req.query.gender));
  if (req.query.verified === 'true') listings = listings.filter(p => p.verified === true);
  if (req.query.area)     listings = listings.filter(p => normalise(p.area).includes(normalise(req.query.area)));
  res.json({ success: true, city: cityData.name, count: listings.length, popular_areas: cityData.pg_and_rent?.popular_student_areas, tips: cityData.pg_and_rent?.tips, filters_applied: req.query, data: listings });
}));

router.get('/:city/budget', asyncHandler(async (req, res) => {
  const cityData = await cityService.getCityBySlug(normalise(req.params.city));
  if (!cityData) return res.status(404).json({ success: false, error: 'City not found.' });
  res.json({ success: true, city: cityData.name, data: { monthly_budget: cityData.pg_and_rent?.avg_monthly_budget_student, food: cityData.food } });
}));

// POST /api/stay/:city/pg/vote/:listingId — community upvote/flag
router.post('/:city/pg/vote/:listingId', asyncHandler(async (req, res) => {
  if (!isDBConnected()) return res.status(503).json({ success: false, error: 'Voting requires MongoDB.' });
  const { action } = req.body; // 'upvote' or 'flag'
  if (!['upvote','flag'].includes(action)) return res.status(400).json({ success: false, error: 'action must be upvote or flag' });
  const city = await cityServiceModule.votePGListing(req.params.city, req.params.listingId, action);
  if (!city) return res.status(404).json({ success: false, error: 'Listing not found.' });
  res.json({ success: true, message: `${action} recorded.` });
}));

module.exports = router;
