// ─────────────────────────────────────────────────────────────
//  routes/admin.js
//
//  All routes require:  Authorization: Bearer <admin_token>
//
//  POST   /api/admin/token          → generate admin token (needs ADMIN_PASSWORD)
//  GET    /api/admin/cities         → list all cities (incl. unpublished)
//  POST   /api/admin/cities         → create a new city
//  PUT    /api/admin/cities/:slug   → update a city
//  DELETE /api/admin/cities/:slug   → delete a city
//  PATCH  /api/admin/cities/:slug/publish  → toggle published
//  POST   /api/admin/seed           → seed DB from mockData.js
//  POST   /api/admin/cities/:slug/pg → add a PG listing
// ─────────────────────────────────────────────────────────────

const express  = require('express');
const jwt      = require('jsonwebtoken');
const router   = express.Router();
const { adminAuth }        = require('../middleware/auth');
const { asyncHandler }     = require('../middleware');
const cityService          = require('../services/cityService');
const City                 = require('../models/City');
const { isDBConnected }    = require('../config/db');

const SECRET = () => process.env.ADMIN_SECRET || 'nestway-secret-change-in-prod';

// ── POST /api/admin/token ────────────────────────────────────
// Exchange ADMIN_PASSWORD for a JWT token
router.post('/token', asyncHandler(async (req, res) => {
  const { password } = req.body;
  const expected = process.env.ADMIN_PASSWORD || 'nestway-admin-2024';
  if (password !== expected) {
    return res.status(401).json({ success: false, error: 'Wrong password.' });
  }
  const token = jwt.sign({ role: 'admin' }, SECRET(), { expiresIn: '30d' });
  res.json({ success: true, token, expires_in: '30 days' });
}));

// ── All routes below require admin JWT ───────────────────────
router.use(adminAuth);

// ── GET /api/admin/cities ────────────────────────────────────
router.get('/cities', asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.json({ success: true, source: 'mock', data: await cityService.getAllCities() });
  }
  const cities = await City.find({}, 'slug name state is_published createdAt').sort('-createdAt');
  res.json({ success: true, count: cities.length, data: cities });
}));

// ── POST /api/admin/cities ───────────────────────────────────
router.post('/cities', asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected. Cannot create cities without MongoDB.' });
  }
  const city = await cityService.createCity({ ...req.body, created_by: 'admin' });
  res.status(201).json({ success: true, message: `City "${city.name}" created.`, data: city });
}));

// ── PUT /api/admin/cities/:slug ──────────────────────────────
router.put('/cities/:slug', asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }
  const city = await cityService.updateCity(req.params.slug, req.body);
  if (!city) return res.status(404).json({ success: false, error: 'City not found.' });
  res.json({ success: true, message: 'City updated.', data: city });
}));

// ── DELETE /api/admin/cities/:slug ───────────────────────────
router.delete('/cities/:slug', asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }
  const city = await cityService.deleteCity(req.params.slug);
  if (!city) return res.status(404).json({ success: false, error: 'City not found.' });
  res.json({ success: true, message: `City "${city.name}" deleted.` });
}));

// ── PATCH /api/admin/cities/:slug/publish ────────────────────
router.patch('/cities/:slug/publish', asyncHandler(async (req, res) => {
  const city = await City.findOneAndUpdate(
    { slug: req.params.slug },
    [{ $set: { is_published: { $not: '$is_published' } } }],
    { new: true }
  );
  if (!city) return res.status(404).json({ success: false, error: 'City not found.' });
  res.json({ success: true, message: `City is now ${city.is_published ? 'published' : 'unpublished'}.`, data: city });
}));

// ── POST /api/admin/seed ─────────────────────────────────────
// Seeds MongoDB from mockData.js — safe to run multiple times
router.post('/seed', asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected. Connect MongoDB first.' });
  }
  const count = await cityService.seedFromMock();
  res.json({ success: true, message: `Seeded ${count} new cities from mock data.`, seeded: count });
}));

// ── POST /api/admin/cities/:slug/pg ──────────────────────────
// Add a new PG listing to a city
router.post('/cities/:slug/pg', asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }
  const city = await cityService.addPGListing(req.params.slug, { ...req.body, added_by: 'admin' });
  if (!city) return res.status(404).json({ success: false, error: 'City not found.' });
  res.status(201).json({ success: true, message: 'PG listing added.', data: city.pg_and_rent.pg_listings.slice(-1)[0] });
}));

module.exports = router;
