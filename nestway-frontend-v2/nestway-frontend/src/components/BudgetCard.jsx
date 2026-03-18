import React from 'react';
import './Cards.css';

const BUDGET_ROWS = [
  { key: 'rent_pg',    icon: '🏠', label: 'PG / Rent' },
  { key: 'food_mess',  icon: '🍱', label: 'Food (mess)' },
  { key: 'transport',  icon: '🚌', label: 'Transport' },
  { key: 'misc',       icon: '🛍️', label: 'Misc / pocket' },
];

export default function BudgetCard({ budget, food }) {
  if (!budget) return null;

  return (
    <div className="card fade-up">
      <div className="card__header">
        <span className="card__icon">💰</span>
        <h2 className="card__title">Monthly budget estimate</h2>
      </div>

      <div className="budget__rows">
        {BUDGET_ROWS.map((row) => (
          budget[row.key] && (
            <div key={row.key} className="budget__row">
              <span className="budget__row-icon">{row.icon}</span>
              <span className="budget__row-label">{row.label}</span>
              <span className="budget__row-value">{budget[row.key]}</span>
            </div>
          )
        ))}
      </div>

      <div className="budget__total">
        <span>Estimated total</span>
        <span className="budget__total-value">{budget.total_estimate}</span>
      </div>

      {food && (
        <div className="card__section">
          <div className="card__section-label">Food</div>
          <p className="budget__food-range">Mess thali: <strong>{food.mess_thali_range}</strong></p>
          {food.popular_areas && (
            <div className="stay__areas" style={{ marginTop: '8px' }}>
              {food.popular_areas.map((a) => (
                <span key={a} className="stay__area-chip">🍽️ {a}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
