// ─────────────────────────────────────────────────────────────
//  pages/Admin.jsx  —  NestWay Admin Panel
//  Route: /admin
//  Login with ADMIN_PASSWORD → manage cities + PG listings
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Axios instance that auto-attaches Bearer token
const api = (token) => axios.create({
  baseURL: API,
  headers: { Authorization: `Bearer ${token}` },
  timeout: 8000,
});

export default function Admin() {
  const [token,    setToken]   = useState(() => localStorage.getItem('nw_admin_token') || '');
  const [password, setPassword] = useState('');
  const [authErr,  setAuthErr] = useState('');
  const [cities,   setCities]  = useState([]);
  const [tab,      setTab]     = useState('cities'); // 'cities' | 'add-city' | 'add-pg'
  const [msg,      setMsg]     = useState('');
  const [loading,  setLoading] = useState(false);

  // ── New city form state ────────────────────────────────────
  const [newCity, setNewCity] = useState({ name: '', state: '', type: '' });

  // ── New PG form state ──────────────────────────────────────
  const [pgCity,   setPgCity]  = useState('chandigarh');
  const [newPG, setNewPG]      = useState({
    name: '', area: '', near: '', type: 'PG',
    rent_per_month: '', gender: 'Any', includes: '', contact: '',
  });

  // ── Load cities ────────────────────────────────────────────
  const loadCities = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api(token).get('/api/admin/cities');
      setCities(res.data.data || []);
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Failed to load cities'));
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (token) loadCities(); }, [token, loadCities]);

  // ── Login ──────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); setAuthErr('');
    try {
      const res = await axios.post(`${API}/api/admin/token`, { password });
      const t = res.data.token;
      setToken(t);
      localStorage.setItem('nw_admin_token', t);
    } catch {
      setAuthErr('Wrong password. Check your .env ADMIN_PASSWORD.');
    }
  };

  const handleLogout = () => {
    setToken(''); localStorage.removeItem('nw_admin_token'); setCities([]);
  };

  // ── Seed DB ────────────────────────────────────────────────
  const handleSeed = async () => {
    setLoading(true); setMsg('');
    try {
      const res = await api(token).post('/api/admin/seed');
      setMsg(`✅ ${res.data.message}`);
      loadCities();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Seed failed. Is MongoDB connected?'));
    } finally { setLoading(false); }
  };

  // ── Toggle publish ─────────────────────────────────────────
  const handleTogglePublish = async (slug) => {
    try {
      const res = await api(token).patch(`/api/admin/cities/${slug}/publish`);
      setMsg(`✅ ${res.data.message}`);
      loadCities();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Failed.'));
    }
  };

  // ── Delete city ────────────────────────────────────────────
  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api(token).delete(`/api/admin/cities/${slug}`);
      setMsg(`✅ Deleted "${name}"`);
      loadCities();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Delete failed.'));
    }
  };

  // ── Add city ───────────────────────────────────────────────
  const handleAddCity = async (e) => {
    e.preventDefault(); setMsg('');
    if (!newCity.name.trim()) return setMsg('❌ City name is required.');
    try {
      const res = await api(token).post('/api/admin/cities', {
        ...newCity, is_published: false,
        // Minimal placeholder data — edit via PUT after creation
        weather: { current: { temp_c: 25, condition: 'Sunny', humidity: 50, wind_kph: 10 }, best_months_to_visit: [], avoid_months: [], tip: '' },
        travel:  { from_cities: [], local_transport: [] },
        hotels:  [], pg_and_rent: { popular_student_areas: [], tips: [], avg_monthly_budget_student: {}, pg_listings: [] },
        food:    { mess_thali_range: '', popular_areas: [] },
      });
      setMsg(`✅ Created "${res.data.data.name}" (unpublished). Add details then publish.`);
      setNewCity({ name: '', state: '', type: '' });
      setTab('cities'); loadCities();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Create failed. Is MongoDB connected?'));
    }
  };

  // ── Add PG listing ─────────────────────────────────────────
  const handleAddPG = async (e) => {
    e.preventDefault(); setMsg('');
    if (!pgCity.trim() || !newPG.name.trim()) return setMsg('❌ City slug and PG name are required.');
    const payload = {
      ...newPG,
      includes: newPG.includes.split(',').map(s => s.trim()).filter(Boolean),
      verified: false,
    };
    try {
      await api(token).post(`/api/admin/cities/${pgCity}/pg`, payload);
      setMsg(`✅ PG listing "${newPG.name}" added to ${pgCity}.`);
      setNewPG({ name: '', area: '', near: '', type: 'PG', rent_per_month: '', gender: 'Any', includes: '', contact: '' });
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Failed.'));
    }
  };

  // ── Login screen ───────────────────────────────────────────
  if (!token) {
    return (
      <div className="admin-login">
        <Link to="/" className="admin__logo"><span>Nest</span><span style={{ color:'var(--saffron)' }}>Way</span></Link>
        <div className="admin-login__card">
          <h1 className="admin-login__title">Admin Panel</h1>
          <p className="admin-login__sub">Enter your ADMIN_PASSWORD from .env</p>
          {authErr && <div className="admin__err">{authErr}</div>}
          <form onSubmit={handleLogin} className="admin-login__form">
            <input
              type="password" placeholder="Admin password"
              value={password} onChange={e => setPassword(e.target.value)}
              className="admin__input" autoFocus
            />
            <button type="submit" className="admin__btn admin__btn--primary">Login →</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main admin UI ──────────────────────────────────────────
  return (
    <div className="admin">
      <header className="admin__header">
        <Link to="/" className="admin__logo"><span>Nest</span><span style={{ color:'var(--saffron)' }}>Way</span></Link>
        <h1 className="admin__page-title">Admin Panel</h1>
        <button onClick={handleSeed} className="admin__btn admin__btn--teal" disabled={loading}>
          {loading ? '…' : '🌱 Seed DB from mock'}
        </button>
        <button onClick={handleLogout} className="admin__btn admin__btn--ghost">Logout</button>
      </header>

      {msg && <div className={`admin__msg ${msg.startsWith('❌') ? 'admin__msg--err' : 'admin__msg--ok'}`}>{msg}</div>}

      {/* Tabs */}
      <div className="admin__tabs">
        {['cities','add-city','add-pg'].map(t => (
          <button key={t} className={`admin__tab ${tab===t?'admin__tab--active':''}`} onClick={() => { setTab(t); setMsg(''); }}>
            { t === 'cities' ? `🏙️ Cities (${cities.length})` : t === 'add-city' ? '➕ Add city' : '🏠 Add PG listing' }
          </button>
        ))}
      </div>

      <div className="admin__body">

        {/* ── Cities list ── */}
        {tab === 'cities' && (
          <div className="admin__table-wrap">
            {loading && <p className="admin__loading">Loading…</p>}
            {!loading && cities.length === 0 && (
              <div className="admin__empty">
                <p>No cities in database yet.</p>
                <p>Click <strong>Seed DB from mock</strong> to import Chandigarh data, or add a city manually.</p>
              </div>
            )}
            {cities.length > 0 && (
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>City</th><th>State</th><th>Slug</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map(c => (
                    <tr key={c.slug || c.id}>
                      <td className="admin__td-city">{c.name}</td>
                      <td>{c.state || '—'}</td>
                      <td><code>{c.slug || c.id}</code></td>
                      <td>
                        <span className={`admin__badge ${c.is_published ? 'admin__badge--published' : 'admin__badge--draft'}`}>
                          {c.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="admin__actions">
                        <button className="admin__action-btn admin__action-btn--teal"
                          onClick={() => handleTogglePublish(c.slug || c.id)}>
                          {c.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link to={`/results/${c.slug || c.id}`} target="_blank" className="admin__action-btn admin__action-btn--view">View</Link>
                        <button className="admin__action-btn admin__action-btn--red"
                          onClick={() => handleDelete(c.slug || c.id, c.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Add city form ── */}
        {tab === 'add-city' && (
          <form className="admin__form" onSubmit={handleAddCity}>
            <h2 className="admin__form-title">Add a new city</h2>
            <p className="admin__form-sub">Creates a city with placeholder data. Edit the full data via the backend API or mockData.js.</p>
            <div className="admin__field">
              <label>City name *</label>
              <input className="admin__input" placeholder="e.g. Pune" value={newCity.name} onChange={e => setNewCity({...newCity, name: e.target.value})} required />
            </div>
            <div className="admin__field">
              <label>State</label>
              <input className="admin__input" placeholder="e.g. Maharashtra" value={newCity.state} onChange={e => setNewCity({...newCity, state: e.target.value})} />
            </div>
            <div className="admin__field">
              <label>Type</label>
              <input className="admin__input" placeholder="e.g. Metro city" value={newCity.type} onChange={e => setNewCity({...newCity, type: e.target.value})} />
            </div>
            <button type="submit" className="admin__btn admin__btn--primary">Create city →</button>
          </form>
        )}

        {/* ── Add PG listing form ── */}
        {tab === 'add-pg' && (
          <form className="admin__form" onSubmit={handleAddPG}>
            <h2 className="admin__form-title">Add PG / flat listing</h2>
            <div className="admin__field">
              <label>City slug * (e.g. chandigarh)</label>
              <input className="admin__input" placeholder="chandigarh" value={pgCity} onChange={e => setPgCity(e.target.value)} required />
            </div>
            <div className="admin__field-row">
              <div className="admin__field">
                <label>PG name *</label>
                <input className="admin__input" placeholder="Green Valley PG" value={newPG.name} onChange={e => setNewPG({...newPG, name: e.target.value})} required />
              </div>
              <div className="admin__field">
                <label>Type</label>
                <select className="admin__input" value={newPG.type} onChange={e => setNewPG({...newPG, type: e.target.value})}>
                  <option>PG</option><option>Shared flat</option><option>1BHK flat</option><option>2BHK flat</option>
                </select>
              </div>
            </div>
            <div className="admin__field-row">
              <div className="admin__field">
                <label>Area</label>
                <input className="admin__input" placeholder="Sector 14" value={newPG.area} onChange={e => setNewPG({...newPG, area: e.target.value})} />
              </div>
              <div className="admin__field">
                <label>Near (landmark)</label>
                <input className="admin__input" placeholder="Panjab University" value={newPG.near} onChange={e => setNewPG({...newPG, near: e.target.value})} />
              </div>
            </div>
            <div className="admin__field-row">
              <div className="admin__field">
                <label>Rent per month</label>
                <input className="admin__input" placeholder="₹5000 – ₹7000" value={newPG.rent_per_month} onChange={e => setNewPG({...newPG, rent_per_month: e.target.value})} />
              </div>
              <div className="admin__field">
                <label>Gender</label>
                <select className="admin__input" value={newPG.gender} onChange={e => setNewPG({...newPG, gender: e.target.value})}>
                  <option>Any</option><option>Boys</option><option>Girls</option>
                </select>
              </div>
            </div>
            <div className="admin__field">
              <label>Includes (comma-separated)</label>
              <input className="admin__input" placeholder="Meals, WiFi, Laundry" value={newPG.includes} onChange={e => setNewPG({...newPG, includes: e.target.value})} />
            </div>
            <div className="admin__field">
              <label>Contact / source</label>
              <input className="admin__input" placeholder="NoBroker listing" value={newPG.contact} onChange={e => setNewPG({...newPG, contact: e.target.value})} />
            </div>
            <button type="submit" className="admin__btn admin__btn--primary">Add PG listing →</button>
          </form>
        )}
      </div>
    </div>
  );
}
