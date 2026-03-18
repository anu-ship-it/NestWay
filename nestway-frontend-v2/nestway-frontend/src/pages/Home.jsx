/* ─────────────────────────────────────────────────────────────
   pages/Home.jsx  —  NestWay landing & search page
───────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const POPULAR_CITIES = ['Chandigarh', 'Pune', 'Bangalore', 'Hyderabad', 'Jaipur', 'Dehradun'];

const STATS = [
  { value: '50+', label: 'Cities covered' },
  { value: '1000+', label: 'PG listings' },
  { value: '1 search', label: 'All answers' },
];

export default function Home() {
  const [city, setCity]   = useState('');
  const [mode, setMode]   = useState('student'); // 'student' | 'tourist'
  const navigate          = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = city.trim();
    if (!q) return;
    navigate(`/results/${encodeURIComponent(q.toLowerCase())}?mode=${mode}`);
  };

  const handlePopular = (c) => {
    navigate(`/results/${encodeURIComponent(c.toLowerCase())}?mode=${mode}`);
  };

  return (
    <div className="home">
      {/* ── Decorative background ─────────────────────────── */}
      <div className="home__bg">
        <div className="home__bg-circle home__bg-circle--1" />
        <div className="home__bg-circle home__bg-circle--2" />
        <div className="home__bg-grid" />
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="home__nav fade-in">
        <div className="home__logo">
          <span className="home__logo-nest">Nest</span>
          <span className="home__logo-way">Way</span>
        </div>
        <div className="home__nav-links">
          <a href="#how">How it works</a>
          <a href="#cities">Cities</a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <main className="home__hero">
        <div className="home__hero-content stagger">
          <div className="home__eyebrow fade-up">🇮🇳 Built for Indian travellers & students</div>

          <h1 className="home__headline fade-up">
            One search.<br />
            <em>Every answer.</em><br />
            Any city.
          </h1>

          <p className="home__subtext fade-up">
            Travel fares, hotel costs, PG rents, weather — all in one place.
            Stop switching between 6 apps.
          </p>

          {/* ── Mode toggle ────────────────────────────── */}
          <div className="home__mode-toggle fade-up">
            <button
              className={`home__mode-btn ${mode === 'student' ? 'home__mode-btn--active home__mode-btn--student' : ''}`}
              onClick={() => setMode('student')}
            >
              🎓 Student / Relocating
            </button>
            <button
              className={`home__mode-btn ${mode === 'tourist' ? 'home__mode-btn--active home__mode-btn--tourist' : ''}`}
              onClick={() => setMode('tourist')}
            >
              ✈️ Tourist / Traveller
            </button>
          </div>

          {/* ── Search bar ─────────────────────────────── */}
          <form className="home__search fade-up" onSubmit={handleSearch}>
            <div className="home__search-input-wrap">
              <span className="home__search-icon">📍</span>
              <input
                className="home__search-input"
                type="text"
                placeholder={mode === 'student'
                  ? 'Where are you moving? e.g. Chandigarh'
                  : 'Where are you travelling? e.g. Jaipur'}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={`home__search-btn home__search-btn--${mode}`}
              disabled={!city.trim()}
            >
              Search →
            </button>
          </form>

          {/* ── Popular cities ──────────────────────────── */}
          <div className="home__popular fade-up">
            <span className="home__popular-label">Popular:</span>
            {POPULAR_CITIES.map((c) => (
              <button key={c} className="home__popular-chip" onClick={() => handlePopular(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Hero visual card ──────────────────────────── */}
        <div className="home__hero-visual fade-up">
          <div className="home__preview-card">
            <div className="home__preview-header">
              <span className="home__preview-city">Chandigarh</span>
              <span className="home__preview-badge home__preview-badge--student">Student</span>
            </div>
            <div className="home__preview-rows">
              <div className="home__preview-row">
                <span className="home__preview-icon">🌤️</span>
                <div>
                  <div className="home__preview-row-title">Weather</div>
                  <div className="home__preview-row-val">24°C · Best: Oct–Mar</div>
                </div>
              </div>
              <div className="home__preview-row">
                <span className="home__preview-icon">🚆</span>
                <div>
                  <div className="home__preview-row-title">Train from Ludhiana</div>
                  <div className="home__preview-row-val">₹80 – ₹350 · 1h 30m</div>
                </div>
              </div>
              <div className="home__preview-row">
                <span className="home__preview-icon">🏠</span>
                <div>
                  <div className="home__preview-row-title">PG rent (Sector 14)</div>
                  <div className="home__preview-row-val">₹5,000 – ₹8,000/mo</div>
                </div>
              </div>
              <div className="home__preview-row">
                <span className="home__preview-icon">💰</span>
                <div>
                  <div className="home__preview-row-title">Monthly budget</div>
                  <div className="home__preview-row-val">₹9,000 – ₹15,000/mo</div>
                </div>
              </div>
            </div>
            <div className="home__preview-footer">All in one search ✓</div>
          </div>
        </div>
      </main>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="home__stats stagger" id="how">
        {STATS.map((s) => (
          <div key={s.label} className="home__stat fade-up">
            <div className="home__stat-value">{s.value}</div>
            <div className="home__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="home__how">
        <h2 className="home__section-title">How NestWay works</h2>
        <div className="home__steps stagger">
          {[
            { n: '01', title: 'Pick your mode', desc: 'Student moving to a new city, or tourist planning a trip.' },
            { n: '02', title: 'Search your city', desc: 'Type any Indian city. Get results in under 2 seconds.' },
            { n: '03', title: 'See everything', desc: 'Fares, hotels, PGs, weather — one screen, zero tab-switching.' },
          ].map((step) => (
            <div key={step.n} className="home__step fade-up">
              <div className="home__step-num">{step.n}</div>
              <h3 className="home__step-title">{step.title}</h3>
              <p className="home__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="home__footer">
        <span>NestWay · Built at hackathon 2024</span>
        <span>One search. Every answer. Any city.</span>
      </footer>
    </div>
  );
}
