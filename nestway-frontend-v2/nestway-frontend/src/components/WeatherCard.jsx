import React from 'react';
import './Cards.css';

const MONTH_ICONS = { October:'🍂', November:'🍂', February:'🌸', March:'🌸', December:'❄️', January:'❄️' };

export default function WeatherCard({ weather }) {
  if (!weather) return null;
  const { current, best_months_to_visit = [], avoid_months = [], tip } = weather;

  return (
    <div className="card fade-up">
      <div className="card__header">
        <span className="card__icon">🌤️</span>
        <h2 className="card__title">Weather</h2>
      </div>

      {/* Current conditions */}
      <div className="weather__current">
        <div className="weather__temp">{current.temp_c}°C</div>
        <div className="weather__condition">{current.condition}</div>
        <div className="weather__meta-row">
          <span>💧 {current.humidity}%</span>
          <span>💨 {current.wind_kph} km/h</span>
        </div>
      </div>

      {/* Best months */}
      <div className="card__section">
        <div className="card__section-label">Best months to visit</div>
        <div className="weather__months">
          {best_months_to_visit.map((m) => (
            <span key={m} className="weather__month weather__month--good">
              {MONTH_ICONS[m] || '✅'} {m}
            </span>
          ))}
        </div>
      </div>

      {/* Avoid */}
      {avoid_months.length > 0 && (
        <div className="card__section">
          <div className="card__section-label">Avoid these months</div>
          <div className="weather__months">
            {avoid_months.map((m) => (
              <span key={m} className="weather__month weather__month--avoid">⚠️ {m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {tip && <p className="card__tip">💡 {tip}</p>}
    </div>
  );
}
