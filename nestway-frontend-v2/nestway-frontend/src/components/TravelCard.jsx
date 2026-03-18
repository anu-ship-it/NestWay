import React, { useState } from 'react';
import './Cards.css';

const MODE_ICONS = { Train:'🚆', Bus:'🚌', Cab:'🚕', Flight:'✈️' };
const MODE_COLORS = { Train:'var(--teal)', Bus:'#5C6BC0', Cab:'var(--saffron)', Flight:'#E91E8C' };

export default function TravelCard({ travel, city }) {
  const [activeRoute, setActiveRoute] = useState(0);
  if (!travel) return null;

  const routes = travel.routes || [];
  const local  = travel.local  || [];
  const route  = routes[activeRoute];

  return (
    <div className="card fade-up">
      <div className="card__header">
        <span className="card__icon">🗺️</span>
        <h2 className="card__title">Getting to {city}</h2>
      </div>

      {/* Route selector tabs */}
      {routes.length > 0 && (
        <div className="travel__tabs">
          {routes.map((r, i) => (
            <button
              key={r.from}
              className={`travel__tab ${i === activeRoute ? 'travel__tab--active' : ''}`}
              onClick={() => setActiveRoute(i)}
            >
              From {r.from}
              <span className="travel__tab-km">{r.distance_km} km</span>
            </button>
          ))}
        </div>
      )}

      {/* Route options */}
      {route && (
        <div className="travel__options">
          {route.options.map((opt) => (
            <div key={opt.mode} className="travel__option">
              <div className="travel__option-left">
                <span className="travel__option-icon">{MODE_ICONS[opt.mode] || '🚗'}</span>
                <div>
                  <div className="travel__option-mode" style={{ color: MODE_COLORS[opt.mode] }}>
                    {opt.mode}
                  </div>
                  <div className="travel__option-name">{opt.name}</div>
                </div>
              </div>
              <div className="travel__option-right">
                <div className="travel__option-fare">{opt.fare_range}</div>
                <div className="travel__option-dur">{opt.duration}</div>
                {opt.book_url && (
                  <a href={opt.book_url} target="_blank" rel="noreferrer" className="travel__book-btn">
                    Book →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Local transport */}
      {local.length > 0 && (
        <div className="card__section">
          <div className="card__section-label">Local transport in {city}</div>
          <div className="travel__local">
            {local.map((l) => (
              <div key={l.mode} className="travel__local-row">
                <span>{l.mode}</span>
                <span className="travel__local-fare">{l.fare}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
