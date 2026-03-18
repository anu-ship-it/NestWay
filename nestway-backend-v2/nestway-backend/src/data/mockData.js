// ─────────────────────────────────────────────────────────────
//  mockData.js
//  Seed data for Chandigarh. Add more cities by copy-pasting
//  a new entry. When real APIs are ready, this file becomes
//  the fallback / cache layer.
// ─────────────────────────────────────────────────────────────

const cities = {
  chandigarh: {
    name: "Chandigarh",
    state: "Punjab / Haryana",
    type: "Union Territory",

    // ── WEATHER ─────────────────────────────────────────────
    weather: {
      current: {
        temp_c: 24,
        condition: "Partly cloudy",
        humidity: 58,
        wind_kph: 12,
      },
      best_months_to_visit: ["October", "November", "February", "March"],
      avoid_months: ["May", "June", "July"],
      tip: "October–March is ideal. Summers (May–June) are harsh at 40°C+. Monsoon (July–Aug) is scenic but humid.",
    },

    // ── TRAVEL FARES ────────────────────────────────────────
    travel: {
      from_cities: [
        {
          from: "Ludhiana",
          distance_km: 100,
          options: [
            { mode: "Train",  name: "Shatabdi / Intercity", duration: "1h 30m", fare_range: "₹80 – ₹350",  book_url: "https://www.irctc.co.in" },
            { mode: "Bus",    name: "PEPSU / PRTC",         duration: "2h",     fare_range: "₹100 – ₹150", book_url: "https://www.pepsu.in" },
            { mode: "Cab",    name: "Ola / Uber",           duration: "1h 45m", fare_range: "₹700 – ₹1000",book_url: "https://www.olacabs.com" },
            { mode: "Flight", name: "N/A (too close)",      duration: "–",      fare_range: "Not applicable", book_url: null },
          ],
        },
        {
          from: "Delhi",
          distance_km: 260,
          options: [
            { mode: "Train",  name: "Shatabdi Express",  duration: "3h",     fare_range: "₹400 – ₹1200", book_url: "https://www.irctc.co.in" },
            { mode: "Bus",    name: "Volvo AC / HRTC",   duration: "4h 30m", fare_range: "₹300 – ₹600",  book_url: "https://hrtchp.com" },
            { mode: "Cab",    name: "Ola Outstation",    duration: "4h",     fare_range: "₹2500 – ₹3500",book_url: "https://www.olacabs.com" },
            { mode: "Flight", name: "IndiGo / Air India",duration: "1h",     fare_range: "₹2500 – ₹6000",book_url: "https://www.indigo.in" },
          ],
        },
        {
          from: "Mumbai",
          distance_km: 1400,
          options: [
            { mode: "Train",  name: "Mumbai–Chandigarh Exp", duration: "22h",    fare_range: "₹600 – ₹2800", book_url: "https://www.irctc.co.in" },
            { mode: "Flight", name: "IndiGo / SpiceJet",     duration: "2h",     fare_range: "₹3000 – ₹9000",book_url: "https://www.spicejet.com" },
          ],
        },
      ],

      local_transport: [
        { mode: "Auto rickshaw", fare: "₹30 minimum, ~₹10/km" },
        { mode: "City bus (CTU)", fare: "₹10 – ₹40 flat" },
        { mode: "Ola / Uber",    fare: "₹60 – ₹200 within city" },
        { mode: "Rental cycle",  fare: "₹50 – ₹100/day (Sector 17 area)" },
      ],
    },

    // ── HOTELS (Tourist mode) ────────────────────────────────
    hotels: [
      { name: "Hotel Mountview",       stars: 4, area: "Sector 10", price_per_night: "₹4500 – ₹7000", amenities: ["WiFi", "AC", "Pool", "Restaurant"], type: "Luxury" },
      { name: "Hotel Sunbeam",         stars: 3, area: "Sector 22", price_per_night: "₹2000 – ₹3500", amenities: ["WiFi", "AC", "Restaurant"],          type: "Mid-range" },
      { name: "Piccadily Hotel",       stars: 4, area: "Sector 22", price_per_night: "₹3500 – ₹5500", amenities: ["WiFi", "AC", "Gym", "Restaurant"],    type: "Mid-range" },
      { name: "OYO Rooms (multiple)",  stars: 2, area: "Sector 35", price_per_night: "₹700 – ₹1500",  amenities: ["WiFi", "AC"],                         type: "Budget" },
      { name: "Zostel Chandigarh",     stars: 1, area: "Sector 22", price_per_night: "₹400 – ₹800",   amenities: ["WiFi", "Common kitchen", "Lounge"],   type: "Hostel" },
    ],

    // ── PG / RENT (Student mode) ─────────────────────────────
    pg_and_rent: {
      popular_student_areas: ["Sector 14 (PU campus)", "Sector 15", "Sector 11", "Manimajra", "Zirakpur"],

      pg_listings: [
        {
          name: "Green Valley PG",
          area: "Sector 14",
          near: "Panjab University",
          type: "PG",
          rent_per_month: "₹5000 – ₹7000",
          includes: ["Meals", "WiFi", "Laundry"],
          gender: "Boys",
          verified: true,
          contact: "Ask owner on NoBroker",
        },
        {
          name: "Sunrise Girls PG",
          area: "Sector 15",
          near: "Panjab University",
          type: "PG",
          rent_per_month: "₹6000 – ₹9000",
          includes: ["Meals", "WiFi", "AC room"],
          gender: "Girls",
          verified: true,
          contact: "Ask owner on NoBroker",
        },
        {
          name: "Shared flat — Sector 11",
          area: "Sector 11",
          near: "GGDSD College",
          type: "Shared flat",
          rent_per_month: "₹4000 – ₹6000",
          includes: ["WiFi", "Kitchen"],
          gender: "Any",
          verified: false,
          contact: "OLX listing",
        },
        {
          name: "1BHK near UIET",
          area: "Sector 25",
          near: "UIET / PU campus",
          type: "1BHK flat",
          rent_per_month: "₹8000 – ₹12000",
          includes: ["WiFi", "Geyser", "Parking"],
          gender: "Any",
          verified: true,
          contact: "Ask owner on 99acres",
        },
      ],

      avg_monthly_budget_student: {
        rent_pg: "₹5000 – ₹8000",
        food_mess: "₹2500 – ₹4000",
        transport: "₹500 – ₹1000",
        misc: "₹1000 – ₹2000",
        total_estimate: "₹9000 – ₹15000/month",
      },

      tips: [
        "Sector 14 and 15 are closest to Panjab University — highest demand, book early.",
        "Manimajra is cheaper but 20–30 min commute by bus.",
        "Always visit the PG in person before paying advance.",
        "Prefer PGs with a written rent agreement.",
      ],
    },

    // ── FOOD ─────────────────────────────────────────────────
    food: {
      mess_thali_range: "₹60 – ₹120 per meal",
      popular_areas: ["Sector 17 plaza", "Sector 34 food street", "Sector 26 grain market"],
      student_dhabas: ["Pal Dhaba (Sector 28)", "Sindhi Sweets (Sector 17)", "Gopal Sweets (multiple)"],
    },
  },

  // ── ADD MORE CITIES HERE ──────────────────────────────────
  // delhi: { ... },
  // pune: { ... },
};

module.exports = cities;
