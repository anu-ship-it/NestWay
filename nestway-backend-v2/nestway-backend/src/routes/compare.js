// ─────────────────────────────────────────────────────────────
//  routes/compare.js
//
//  GET /api/compare?cities=chandigarh,pune&mode=student
//  Returns both cities' data shaped for side-by-side comparison.
// ─────────────────────────────────────────────────────────────

const express     = require('express');
const router      = express.Router();
const { asyncHandler } = require('../middleware');
const cityService = require('../services/cityService');

router.get('/', asyncHandler(async (req, res) => {
  const { cities: citiesParam, mode = 'student' } = req.query;

  if (!citiesParam) {
    return res.status(400).json({ success: false, error: 'Provide ?cities=city1,city2' });
  }

  const slugs = citiesParam.split(',').map((c) => c.trim().toLowerCase()).slice(0, 2);

  if (slugs.length < 2) {
    return res.status(400).json({ success: false, error: 'Provide exactly 2 cities: ?cities=chandigarh,pune' });
  }

  // Fetch both in parallel
  const [cityA, cityB] = await Promise.all(slugs.map((s) => cityService.getCityBySlug(s)));

  const missing = slugs.filter((s, i) => [cityA, cityB][i] === null);
  if (missing.length) {
    return res.status(404).json({ success: false, error: `City not found: ${missing.join(', ')}` });
  }

  // Shape each city into a compact comparison object
  const shape = (city, mode) => {
    const cheapestHotel = (city.hotels || []).reduce((min, h) => {
      const price = parseInt(h.price_per_night?.replace(/[^\d]/g, '')) || 9999;
      return price < (parseInt(min?.price_per_night?.replace(/[^\d]/g, '')) || 9999) ? h : min;
    }, null);

    const cheapestPG = (city.pg_and_rent?.pg_listings || []).reduce((min, p) => {
      const price = parseInt(p.rent_per_month?.replace(/[^\d]/g, '')) || 99999;
      return price < (parseInt(min?.rent_per_month?.replace(/[^\d]/g, '')) || 99999) ? p : min;
    }, null);

    return {
      name:  city.name,
      state: city.state,

      weather: {
        temp_c:               city.weather?.current?.temp_c,
        condition:            city.weather?.current?.condition,
        best_months:          city.weather?.best_months_to_visit || [],
        tip:                  city.weather?.tip,
      },

      travel: {
        routes_available:     (city.travel?.from_cities || []).length,
        local_options:        (city.travel?.local_transport || []).length,
        sample_routes:        (city.travel?.from_cities || []).slice(0, 2),
      },

      stay: mode === 'student' ? {
        pg_count:             (city.pg_and_rent?.pg_listings || []).length,
        verified_pg_count:    (city.pg_and_rent?.pg_listings || []).filter((p) => p.verified).length,
        cheapest_pg:          cheapestPG,
        popular_areas:        city.pg_and_rent?.popular_student_areas || [],
        monthly_budget:       city.pg_and_rent?.avg_monthly_budget_student,
      } : {
        hotel_count:          (city.hotels || []).length,
        cheapest_hotel:       cheapestHotel,
        hotel_types:          [...new Set((city.hotels || []).map((h) => h.type))],
      },

      food: city.food,
    };
  };

  res.json({
    success: true,
    mode,
    cities: [shape(cityA, mode), shape(cityB, mode)],
  });
}));

module.exports = router;
