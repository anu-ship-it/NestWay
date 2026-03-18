// ─────────────────────────────────────────────────────────────
//  hooks/useCityData.js
//  Fetches all city data from the NestWay backend.
//  Falls back to built-in mock data if the backend is offline.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Inline fallback so the UI works even without the backend ──
const FALLBACK = {
  chandigarh: {
    name: 'Chandigarh', state: 'Punjab / Haryana',
    weather: {
      current: { temp_c: 24, condition: 'Partly cloudy', humidity: 58, wind_kph: 12 },
      best_months_to_visit: ['October', 'November', 'February', 'March'],
      avoid_months: ['May', 'June', 'July'],
      tip: 'October–March is ideal. Summers (May–June) are harsh at 40°C+.',
    },
    travel: {
      routes: [
        { from: 'Ludhiana', distance_km: 100, options: [
          { mode: 'Train', name: 'Intercity Express', duration: '1h 30m', fare_range: '₹80 – ₹350', book_url: 'https://www.irctc.co.in' },
          { mode: 'Bus',   name: 'PEPSU / PRTC',     duration: '2h',     fare_range: '₹100 – ₹150', book_url: null },
          { mode: 'Cab',   name: 'Ola / Uber',       duration: '1h 45m', fare_range: '₹700 – ₹1000',book_url: 'https://www.olacabs.com' },
        ]},
        { from: 'Delhi', distance_km: 260, options: [
          { mode: 'Train',  name: 'Shatabdi Express',  duration: '3h',     fare_range: '₹400 – ₹1200', book_url: 'https://www.irctc.co.in' },
          { mode: 'Bus',    name: 'Volvo AC / HRTC',   duration: '4h 30m', fare_range: '₹300 – ₹600',  book_url: null },
          { mode: 'Flight', name: 'IndiGo / Air India', duration: '1h',    fare_range: '₹2500 – ₹6000',book_url: 'https://www.indigo.in' },
        ]},
      ],
      local: [
        { mode: 'Auto rickshaw',  fare: '₹30 min, ~₹10/km' },
        { mode: 'City bus (CTU)', fare: '₹10 – ₹40 flat' },
        { mode: 'Ola / Uber',    fare: '₹60 – ₹200 within city' },
      ],
    },
    hotels: [
      { name: 'Hotel Mountview',      stars: 4, area: 'Sector 10', price_per_night: '₹4500 – ₹7000', type: 'Luxury',    amenities: ['WiFi','AC','Pool','Restaurant'] },
      { name: 'Hotel Sunbeam',        stars: 3, area: 'Sector 22', price_per_night: '₹2000 – ₹3500', type: 'Mid-range', amenities: ['WiFi','AC','Restaurant'] },
      { name: 'OYO Rooms',            stars: 2, area: 'Sector 35', price_per_night: '₹700 – ₹1500',  type: 'Budget',    amenities: ['WiFi','AC'] },
      { name: 'Zostel Chandigarh',    stars: 1, area: 'Sector 22', price_per_night: '₹400 – ₹800',   type: 'Hostel',    amenities: ['WiFi','Kitchen','Lounge'] },
    ],
    pg_and_rent: {
      popular_student_areas: ['Sector 14 (PU campus)', 'Sector 15', 'Manimajra', 'Zirakpur'],
      tips: ['Sector 14 is closest to Panjab University — book early.', 'Always visit in person before paying advance.', 'Ask for a written rent agreement.'],
      avg_monthly_budget_student: {
        rent_pg: '₹5000 – ₹8000', food_mess: '₹2500 – ₹4000',
        transport: '₹500 – ₹1000', misc: '₹1000 – ₹2000',
        total_estimate: '₹9000 – ₹15000/month',
      },
      pg_listings: [
        { name: 'Green Valley PG',     area: 'Sector 14', near: 'Panjab University', type: 'PG',          rent_per_month: '₹5000 – ₹7000', gender: 'Boys',  verified: true,  includes: ['Meals','WiFi','Laundry'] },
        { name: 'Sunrise Girls PG',    area: 'Sector 15', near: 'Panjab University', type: 'PG',          rent_per_month: '₹6000 – ₹9000', gender: 'Girls', verified: true,  includes: ['Meals','WiFi','AC room'] },
        { name: 'Shared flat Sec-11',  area: 'Sector 11', near: 'GGDSD College',     type: 'Shared flat', rent_per_month: '₹4000 – ₹6000', gender: 'Any',   verified: false, includes: ['WiFi','Kitchen'] },
        { name: '1BHK near UIET',      area: 'Sector 25', near: 'UIET / PU campus',  type: '1BHK flat',   rent_per_month: '₹8000 – ₹12000',gender: 'Any',   verified: true,  includes: ['WiFi','Geyser','Parking'] },
      ],
    },
    food: {
      mess_thali_range: '₹60 – ₹120 per meal',
      popular_areas: ['Sector 17 plaza', 'Sector 34 food street', 'Sector 26 grain market'],
    },
  },
};

export function useCityData(cityName, mode) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!cityName) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_BASE}/api/city/${cityName.toLowerCase()}?mode=${mode || 'all'}`,
          { timeout: 5000 }
        );
        if (!cancelled) setData(res.data.data);
      } catch {
        // Backend offline → use fallback silently
        const fallback = FALLBACK[cityName.toLowerCase()];
        if (!cancelled) {
          if (fallback) setData(fallback);
          else setError(`No data found for "${cityName}". Try "Chandigarh".`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [cityName, mode]);

  return { data, loading, error };
}
