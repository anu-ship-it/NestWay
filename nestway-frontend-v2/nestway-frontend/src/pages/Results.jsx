/* ─────────────────────────────────────────────────────────────
   pages/Results.jsx  —  City results page
   Shows weather, travel, hotels/PGs, budget in one scroll.
───────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCityData } from '../hooks/useCityData';
import WeatherCard      from '../components/WeatherCard';
import TravelCard       from '../components/TravelCard';
import StayCard         from '../components/StayCard';
import BudgetCard       from '../components/BudgetCard';
import './Results.css';

export default function Results() {
  const { city }              = useParams();
  const [params]              = useSearchParams();
  const navigate              = useNavigate();
  const initialMode           = params.get('mode') || 'student';
  const [mode, setMode]       = useState(initialMode);
  const [search, setSearch]   = useState('');

  const { data, loading, error } = useCityData(city, mode);

  const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/results/${search.trim().toLowerCase()}?mode=${mode}`);
  };

  const switchMode = (m) => {
    setMode(m);
    navigate(`/results/${city}?mode=${m}`, { replace: true });
  };

  return (
    <div className="results">
      {/* ── Sticky header ─────────────────────────────────── */}
      <header className="results__header">
        <Link to="/" className="results__logo">
          <span>Nest</span><span style={{ color: 'var(--saffron)' }}>Way</span>
        </Link>

        {/* Inline search */}
        <form className="results__search" onSubmit={handleNewSearch}>
          <span className="results__search-icon">📍</span>
          <input
            className="results__search-input"
            placeholder="Search another city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="submit" className="results__search-go">→</button>
          )}
        </form>

        {/* Mode switch */}
        <div className="results__mode-toggle">
          <button
            className={`results__mode-btn ${mode === 'student' ? 'results__mode-btn--student' : ''}`}
            onClick={() => switchMode('student')}
          >🎓 Student</button>
          <button
            className={`results__mode-btn ${mode === 'tourist' ? 'results__mode-btn--tourist' : ''}`}
            onClick={() => switchMode('tourist')}
          >✈️ Tourist</button>
        </div>
      </header>

      {/* ── City banner ───────────────────────────────────── */}
      <div className={`results__banner results__banner--${mode}`}>
        <div className="results__banner-inner">
          <div>
            <h1 className="results__city-name">{cityDisplay}</h1>
            {data && <p className="results__city-meta">{data.state}</p>}
          </div>
          <span className={`results__mode-badge results__mode-badge--${mode}`}>
            {mode === 'student' ? '🎓 Student mode' : '✈️ Tourist mode'}
          </span>
        </div>
      </div>

      {/* ── Loading ───────────────────────────────────────── */}
      {loading && (
        <div className="results__loading">
          <div className="results__spinner" />
          <p>Fetching everything about {cityDisplay}…</p>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────── */}
      {error && !loading && (
        <div className="results__error">
          <div className="results__error-icon">🤔</div>
          <h2>City not found</h2>
          <p>{error}</p>
          <Link to="/" className="results__error-back">← Back to search</Link>
        </div>
      )}

      {/* ── Results grid ─────────────────────────────────── */}
      {data && !loading && (
        <div className="results__grid stagger">
          <WeatherCard weather={data.weather} />
          <TravelCard  travel={data.travel}   city={cityDisplay} />
          {mode === 'student'
            ? <StayCard  pg={data.pg_and_rent} mode="student" />
            : <StayCard  hotels={data.hotels}  mode="tourist" />
          }
          {mode === 'student' && data.pg_and_rent && (
            <BudgetCard budget={data.pg_and_rent.avg_monthly_budget_student} food={data.food} />
          )}
        </div>
      )}

      <footer className="results__footer">
        NestWay · Data may vary · Always verify before booking
      </footer>
    </div>
  );
}
