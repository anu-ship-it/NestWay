// ─────────────────────────────────────────────────────────────
//  models/City.js  —  Mongoose schema for a city document
//  Mirrors the shape of mockData.js exactly so the rest of
//  the codebase can swap DB ↔ mock without changing routes.
// ─────────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ── Sub-schemas ──────────────────────────────────────────────

const TravelOptionSchema = new Schema({
  mode:       String,
  name:       String,
  duration:   String,
  fare_range: String,
  book_url:   String,
}, { _id: false });

const RouteSchema = new Schema({
  from:        String,
  distance_km: Number,
  options:     [TravelOptionSchema],
}, { _id: false });

const LocalTransportSchema = new Schema({
  mode: String,
  fare: String,
}, { _id: false });

const HotelSchema = new Schema({
  name:            String,
  stars:           Number,
  area:            String,
  price_per_night: String,
  amenities:       [String],
  type:            String,
}, { _id: false });

const PGListingSchema = new Schema({
  name:           String,
  area:           String,
  near:           String,
  type:           String,
  rent_per_month: String,
  includes:       [String],
  gender:         { type: String, enum: ['Boys', 'Girls', 'Any'] },
  verified:       { type: Boolean, default: false },
  contact:        String,
  upvotes:        { type: Number, default: 0 },
  flags:          { type: Number, default: 0 },
  added_by:       String,
}, { _id: true, timestamps: true });

// ── Main City schema ─────────────────────────────────────────

const CitySchema = new Schema({
  // Lookup key — lowercase, no spaces e.g. "chandigarh"
  slug:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:  { type: String, required: true },
  state: String,
  type:  String,

  weather: {
    current: {
      temp_c:    Number,
      condition: String,
      humidity:  Number,
      wind_kph:  Number,
    },
    best_months_to_visit: [String],
    avoid_months:         [String],
    tip:                  String,
  },

  travel: {
    from_cities:     [RouteSchema],
    local_transport: [LocalTransportSchema],
  },

  hotels:     [HotelSchema],

  pg_and_rent: {
    popular_student_areas:       [String],
    tips:                        [String],
    avg_monthly_budget_student: {
      rent_pg:        String,
      food_mess:      String,
      transport:      String,
      misc:           String,
      total_estimate: String,
    },
    pg_listings: [PGListingSchema],
  },

  food: {
    mess_thali_range: String,
    popular_areas:    [String],
    student_dhabas:   [String],
  },

  // Meta
  is_published: { type: Boolean, default: false },
  created_by:   String,

}, { timestamps: true });

// Index for fast slug lookup
CitySchema.index({ slug: 1 });

module.exports = mongoose.model('City', CitySchema);
