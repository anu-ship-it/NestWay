import React, { useState } from 'react';
import './Cards.css';

const STAR_MAP = { 4:'Luxury', 3:'Mid-range', 2:'Budget', 1:'Hostel' };

export default function StayCard({ hotels, pg, mode }) {

  // ── Tourist: Hotels ──────────────────────────────────────────
  if (mode === 'tourist' && hotels) {
    return (
      <div className="card fade-up">
        <div className="card__header">
          <span className="card__icon">🏨</span>
          <h2 className="card__title">Where to stay</h2>
        </div>
        <div className="stay__list">
          {hotels.map((h) => (
            <div key={h.name} className="stay__hotel">
              <div className="stay__hotel-left">
                <div className="stay__hotel-name">{h.name}</div>
                <div className="stay__hotel-area">📍 {h.area}</div>
                <div className="stay__amenities">
                  {h.amenities.map((a) => <span key={a} className="stay__amenity">{a}</span>)}
                </div>
              </div>
              <div className="stay__hotel-right">
                <div className="stay__hotel-type">{STAR_MAP[h.stars] || h.type}</div>
                <div className="stay__hotel-price">{h.price_per_night}</div>
                <div className="stay__hotel-per">per night</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Student: PG listings ─────────────────────────────────────
  if (mode === 'student' && pg) {
    const [filter, setFilter] = useState('All');
    const genders = ['All', 'Boys', 'Girls', 'Any'];

    const filtered = filter === 'All'
      ? pg.pg_listings
      : pg.pg_listings.filter((p) => p.gender.toLowerCase() === filter.toLowerCase());

    return (
      <div className="card fade-up">
        <div className="card__header">
          <span className="card__icon">🏠</span>
          <h2 className="card__title">PG &amp; Rent</h2>
        </div>

        {/* Popular areas */}
        {pg.popular_student_areas && (
          <div className="card__section">
            <div className="card__section-label">Popular student areas</div>
            <div className="stay__areas">
              {pg.popular_student_areas.map((a) => (
                <span key={a} className="stay__area-chip">📍 {a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Gender filter */}
        <div className="stay__filter-row">
          {genders.map((g) => (
            <button
              key={g}
              className={`stay__filter-btn ${filter === g ? 'stay__filter-btn--active' : ''}`}
              onClick={() => setFilter(g)}
            >{g}</button>
          ))}
        </div>

        {/* PG list */}
        <div className="stay__list">
          {filtered.map((p) => (
            <div key={p.name} className="stay__pg">
              <div className="stay__pg-top">
                <div>
                  <div className="stay__pg-name">
                    {p.name}
                    {p.verified && <span className="stay__verified">✓ Verified</span>}
                  </div>
                  <div className="stay__pg-near">📍 {p.area} · near {p.near}</div>
                </div>
                <div className="stay__pg-right">
                  <div className="stay__pg-price">{p.rent_per_month}</div>
                  <div className="stay__pg-per">per month</div>
                  <span className={`stay__gender stay__gender--${p.gender.toLowerCase()}`}>{p.gender}</span>
                </div>
              </div>
              <div className="stay__includes">
                {p.includes.map((i) => <span key={i} className="stay__include-chip">{i}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        {pg.tips && (
          <div className="card__section">
            <div className="card__section-label">Tips for students</div>
            {pg.tips.map((t, i) => (
              <p key={i} className="card__tip">💡 {t}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
