// ─────────────────────────────────────────────────────────────
//  services/cityService.js
//  All city data access goes through here.
//  → If MongoDB is connected: query the DB
//  → If not: fall back to mockData.js
//  Routes never import mockData directly — only this service.
// ─────────────────────────────────────────────────────────────

const { isDBConnected } = require('../config/db');
const City              = require('../models/City');
const mockData          = require('../data/mockData');

// Normalise city name to slug format
const toSlug = (str) => str.toLowerCase().trim().replace(/\s+/g, '-');

// ── Get all cities (list) ────────────────────────────────────
const getAllCities = async () => {
  if (isDBConnected()) {
    const cities = await City.find({ is_published: true }, 'slug name state type');
    return cities.map((c) => ({ id: c.slug, name: c.name, state: c.state }));
  }
  return Object.entries(mockData).map(([key, val]) => ({
    id: key, name: val.name, state: val.state,
  }));
};

// ── Get single city (full data) ──────────────────────────────
const getCityBySlug = async (slug) => {
  if (isDBConnected()) {
    const city = await City.findOne({ slug: toSlug(slug), is_published: true }).lean();
    if (!city) return null;
    // Reshape DB doc to match mock data shape (routes vs from_cities)
    return {
      name:        city.name,
      state:       city.state,
      weather:     city.weather,
      travel: {
        from_cities:    city.travel?.from_cities    || [],
        local_transport: city.travel?.local_transport || [],
      },
      hotels:      city.hotels || [],
      pg_and_rent: city.pg_and_rent || {},
      food:        city.food || {},
    };
  }
  return mockData[toSlug(slug)] || null;
};

// ── Create city (admin) ──────────────────────────────────────
const createCity = async (payload) => {
  const city = new City({ ...payload, slug: toSlug(payload.name) });
  return city.save();
};

// ── Update city (admin) ──────────────────────────────────────
const updateCity = async (slug, payload) => {
  return City.findOneAndUpdate(
    { slug: toSlug(slug) },
    { $set: payload },
    { new: true, runValidators: true }
  );
};

// ── Delete city (admin) ──────────────────────────────────────
const deleteCity = async (slug) => {
  return City.findOneAndDelete({ slug: toSlug(slug) });
};

// ── Add PG listing to a city ─────────────────────────────────
const addPGListing = async (slug, listing) => {
  return City.findOneAndUpdate(
    { slug: toSlug(slug) },
    { $push: { 'pg_and_rent.pg_listings': listing } },
    { new: true }
  );
};

// ── Upvote / flag a PG listing ───────────────────────────────
const votePGListing = async (citySlug, listingId, action) => {
  const field = action === 'upvote'
    ? 'pg_and_rent.pg_listings.$.upvotes'
    : 'pg_and_rent.pg_listings.$.flags';

  return City.findOneAndUpdate(
    { slug: toSlug(citySlug), 'pg_and_rent.pg_listings._id': listingId },
    { $inc: { [field]: 1 } },
    { new: true }
  );
};

// ── Seed DB from mock data (admin utility) ───────────────────
const seedFromMock = async () => {
  let seeded = 0;
  for (const [key, val] of Object.entries(mockData)) {
    const exists = await City.findOne({ slug: key });
    if (!exists) {
      await City.create({
        slug:        key,
        name:        val.name,
        state:       val.state,
        type:        val.type,
        weather:     val.weather,
        travel:      { from_cities: val.travel.from_cities, local_transport: val.travel.local_transport },
        hotels:      val.hotels,
        pg_and_rent: val.pg_and_rent,
        food:        val.food,
        is_published: true,
        created_by:  'seed',
      });
      seeded++;
    }
  }
  return seeded;
};

module.exports = { getAllCities, getCityBySlug, createCity, updateCity, deleteCity, addPGListing, votePGListing, seedFromMock };
