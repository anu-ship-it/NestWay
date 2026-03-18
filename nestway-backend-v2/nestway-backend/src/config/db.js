// ─────────────────────────────────────────────────────────────
//  config/db.js  —  MongoDB Atlas connection
//  Uses MONGO_URI from .env
//  Falls back to mock data if DB is unreachable
// ─────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    console.log('[DB] No MONGO_URI set — running in mock-data-only mode');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('[DB] MongoDB connected ✓');
  } catch (err) {
    console.warn('[DB] MongoDB connection failed — falling back to mock data:', err.message);
  }
};

const isDBConnected = () => isConnected;

module.exports = { connectDB, isDBConnected };
