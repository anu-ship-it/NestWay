// ─────────────────────────────────────────────────────────────
//  pages/Compare.jsx  —  Side-by-side city comparison
//  Route: /compare?cities=chandigarh,pune&mode=student
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Compare.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Hardcoded fallback comparison data (works offline)
const FALLBACK_COMPARE = {
  student: {
    cities: [
      {
        name: 'Chandigarh', state: 'Punjab / Haryana',
        weather: { temp_c: 24, condition: 'Partly cloudy', best_months: ['Oct','Nov','Feb','Mar'], tip: 'Best Oct–Mar' },
        travel: { routes_available: 2, sample_routes: [{ from: 'Ludhiana', options: [{ mode: 'Train', fare_range: '₹80–₹350', duration: '1h 30m' }] }] },
        stay: { pg_count: 4, verified_pg_count: 3, cheapest_pg: { name: 'Shared flat Sec-11', rent_per_month: '₹4000 – ₹6000', area: 'Sector 11' }, popular_areas: ['Sector 14', 'Sector 15'], monthly_budget: { total_estimate: '₹9,000 – ₹15,000/month', rent_pg: '₹5000–₹8000', food_mess: '₹2500–₹4000' } },
        food: { mess_thali_range: '₹60 – ₹120 per meal' },
      },
      {
        name: 'Pune', state: 'Maharashtra',
        weather: { temp_c: 28, condition: 'Sunny', best_months: ['Oct','Nov','Dec','Jan'], tip: 'Pleasant year-round. Monsoon Jul–Sep is scenic.' },
        travel: { routes_available: 3, sample_routes: [{ from: 'Mumbai', options: [{ mode: 'Train', fare_range: '₹50–₹200', duration: '3h' }] }] },
        stay: { pg_count: 6, verified_pg_count: 4, cheapest_pg: { name: 'Kothrud PG', rent_per_month: '₹6000 – ₹10000', area: 'Kothrud' }, popular_areas: ['Kothrud', 'Shivajinagar', 'Viman Nagar'], monthly_budget: { total_estimate: '₹12,000 – ₹20,000/month', rent_pg: '₹6000–₹10000', food_mess: '₹3000–₹5000' } },
        food: { mess_thali_range: '₹80 – ₹150 per meal' },
      },
    ],
  },
};

const ICONS = { Train:'🚆', Bus:'🚌', Cab:'🚕', Flight:'✈️' };

export default function Compare() {
  const [params]         = useSearchParams();
  const navigate         = useNavigate();
  const initialCities    = (params.get('cities') || 'chandigarh,pune').split(',');
  const initialMode      = params.get('mode') || 'student';

  const [cityA, setCityA]   = useState(initialCities[0] || 'chandigarh');
  const [cityB, setCityB]   = useState(initialCities[1] || 'pune');
  const [mode, setMode]     = useState(initialMode);
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const fetchCompare = async (a, b, m) => {
    if (!a.trim() || !b.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API}/api/compare?cities=${a},${b}&mode=${m}`, { timeout: 5000 });
      setData(res.data);
    } catch {
      setData(FALLBACK_COMPARE[m] ? { ...FALLBACK_COMPARE[m], mode: m } : null);
      if (!FALLBACK_COMPARE[m]) setError('Could not load comparison data.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCompare(cityA, cityB, mode); }, []);

  const handleCompare = (e) => {
    e.preventDefault();
    navigate(`/compare?cities=${cityA},${cityB}&mode=${mode}`, { replace: true });
    fetchCompare(cityA, cityB, mode);
  };

  const cities = data?.cities || [];

  return (
    <div className="compare">
      {/* Header */}
      <header className="compare__header">
        <Link to="/" className="compare__logo">
          <span>Nest</span><span style={{ color: 'var(--saffron)' }}>Way</span>
        </Link>
        <h1 className="compare__page-title">Compare Cities</h1>
        <div className="compare__mode-toggle">
          <button className={`cmp-mode-btn ${mode==='student'?'cmp-mode-btn--student':''}`} onClick={()=>{ setMode('student'); fetchCompare(cityA,cityB,'student'); }}>🎓 Student</button>
          <button className={`cmp-mode-btn ${mode==='tourist'?'cmp-mode-btn--tourist':''}`} onClick={()=>{ setMode('tourist'); fetchCompare(cityA,cityB,'tourist'); }}>✈️ Tourist</button>
        </div>
      </header>

      {/* Search form */}
      <form className="compare__form" onSubmit={handleCompare}>
        <div className="compare__inputs">
          <div className="compare__input-wrap">
            <span>📍</span>
            <input className="compare__input" placeholder="City one e.g. Chandigarh" value={cityA} onChange={e=>setCityA(e.target.value)} />
          </div>
          <div className="compare__vs">VS</div>
          <div className="compare__input-wrap">
            <span>📍</span>
            <input className="compare__input" placeholder="City two e.g. Pune" value={cityB} onChange={e=>setCityB(e.target.value)} />
          </div>
          <button type="submit" className="compare__go-btn">Compare →</button>
        </div>
      </form>

      {loading && (
        <div className="compare__loading">
          <div className="compare__spinner" />
          <p>Comparing cities…</p>
        </div>
      )}

      {error && <div className="compare__error">{error}</div>}

      {!loading && cities.length === 2 && (
        <div className="compare__body">

          {/* City name headers */}
          <div className="compare__cols">
            <div className="compare__col-label" />
            {cities.map(c => (
              <div key={c.name} className={`compare__col-header compare__col-header--${mode}`}>
                <div className="compare__col-city">{c.name}</div>
                <div className="compare__col-state">{c.state}</div>
                <Link to={`/results/${c.name.toLowerCase()}?mode=${mode}`} className="compare__col-link">Full details →</Link>
              </div>
            ))}
          </div>

          {/* ── Weather row ── */}
          <CompareSection label="🌤️ Weather" rows={[
            { label: 'Temperature', values: cities.map(c => `${c.weather.temp_c}°C`) },
            { label: 'Condition',   values: cities.map(c => c.weather.condition) },
            { label: 'Best months', values: cities.map(c => c.weather.best_months.slice(0,3).join(', ')) },
            { label: 'Tip',         values: cities.map(c => c.weather.tip), small: true },
          ]} />

          {/* ── Stay row ── */}
          {mode === 'student' ? (
            <CompareSection label="🏠 PG &amp; Rent" rows={[
              { label: 'Total listings',    values: cities.map(c => `${c.stay.pg_count} PGs`) },
              { label: 'Verified listings', values: cities.map(c => `${c.stay.verified_pg_count} verified`) },
              { label: 'Cheapest PG',       values: cities.map(c => c.stay.cheapest_pg?.rent_per_month || '—'), highlight: true },
              { label: 'Popular areas',     values: cities.map(c => c.stay.popular_areas.slice(0,3).join(', ')) },
              { label: 'Monthly budget',    values: cities.map(c => c.stay.monthly_budget?.total_estimate || '—'), highlight: true },
              { label: 'Rent',              values: cities.map(c => c.stay.monthly_budget?.rent_pg || '—') },
              { label: 'Food (mess)',       values: cities.map(c => c.stay.monthly_budget?.food_mess || '—') },
            ]} />
          ) : (
            <CompareSection label="🏨 Hotels" rows={[
              { label: 'Total hotels',    values: cities.map(c => `${c.stay.hotel_count} hotels`) },
              { label: 'Cheapest option', values: cities.map(c => c.stay.cheapest_hotel?.price_per_night || '—'), highlight: true },
              { label: 'Hotel types',     values: cities.map(c => (c.stay.hotel_types||[]).join(', ')) },
            ]} />
          )}

          {/* ── Travel row ── */}
          <CompareSection label="🗺️ Getting there" rows={[
            { label: 'Routes available', values: cities.map(c => `${c.travel.routes_available} origin cities`) },
            ...cities[0].travel.sample_routes.slice(0,1).flatMap(route =>
              route.options.slice(0,2).map(opt => ({
                label: `From ${route.from} by ${opt.mode}`,
                values: cities.map(c => {
                  const r = c.travel.sample_routes.find(sr => sr.from === route.from);
                  const o = r?.options.find(o => o.mode === opt.mode);
                  return o ? `${o.fare_range} · ${o.duration}` : '—';
                }),
              }))
            ),
          ]} />

          {/* ── Food row ── */}
          <CompareSection label="🍱 Food" rows={[
            { label: 'Mess thali', values: cities.map(c => c.food?.mess_thali_range || '—') },
          ]} />

          {/* ── Winner summary ── */}
          <div className="compare__verdict">
            <div className="compare__verdict-title">Quick verdict</div>
            <div className="compare__verdict-cols">
              {cities.map((c, i) => (
                <div key={c.name} className={`compare__verdict-card compare__verdict-card--${mode}`}>
                  <div className="compare__verdict-city">{c.name}</div>
                  <div className="compare__verdict-points">
                    {mode === 'student' ? <>
                      <div>💰 Budget: {c.stay.monthly_budget?.total_estimate}</div>
                      <div>🏠 Cheapest PG: {c.stay.cheapest_pg?.rent_per_month}</div>
                      <div>🌤️ Best time: {c.weather.best_months.slice(0,2).join(', ')}</div>
                    </> : <>
                      <div>🌤️ Weather: {c.weather.temp_c}°C, {c.weather.condition}</div>
                      <div>🏨 Hotels from: {c.stay.cheapest_hotel?.price_per_night}</div>
                      <div>📅 Visit: {c.weather.best_months.slice(0,2).join(', ')}</div>
                    </>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CompareSection helper component ─────────────────────────
function CompareSection({ label, rows }) {
  return (
    <div className="compare__section">
      <div className="compare__section-label" dangerouslySetInnerHTML={{ __html: label }} />
      {rows.map((row) => (
        <div key={row.label} className={`compare__row ${row.highlight ? 'compare__row--highlight' : ''}`}>
          <div className="compare__row-label">{row.label}</div>
          {row.values.map((v, i) => (
            <div key={i} className={`compare__row-val ${row.small ? 'compare__row-val--small' : ''}`}>{v || '—'}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
