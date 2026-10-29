import React from 'react';
import { formatCurrency } from '../utils/calculations';
import { Layers } from 'lucide-react';

export default function CategoryChart({ categories }) {
  const categoryColors = {
    'Beverages': '#F59E0B',     // Soft Gold
    'Home Goods': '#D97706',    // Deep Honey
    'Accessories': '#EA580C',   // Burnt Amber
    'Stationery': '#B45309',    // Roasted Ochre
    'Personal Care': '#10B981'  // Heritage Neem Green
  };

  return (
    <div className="glass-panel category-card">
      <div className="cat-header">
        <div className="cat-title-row">
          <div className="cat-icon-box">
            <Layers size={17} />
          </div>
          <div>
            <h3 className="cat-title">Revenue by Category</h3>
            <p className="cat-subtitle">Contribution across catalog departments</p>
          </div>
        </div>
      </div>

      <div className="cat-list">
        {categories.map((cat) => {
          const color = categoryColors[cat.category] || '#FBBF24';

          return (
            <div key={cat.category} className="cat-item">
              <div className="cat-item-top">
                <div className="cat-name-group">
                  <span className="cat-color-dot" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }} />
                  <span className="cat-name">{cat.category}</span>
                  <span className="cat-units-sold">({cat.unitsSold} units)</span>
                </div>
                <div className="cat-values">
                  <span className="cat-amount">{formatCurrency(cat.revenue)}</span>
                  <span className="cat-share">{cat.share}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="cat-progress-track">
                <div 
                  className="cat-progress-fill" 
                  style={{ 
                    width: `${cat.share}%`, 
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}60`
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .category-card {
          padding: 24px 26px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
        }

        .cat-header {
          margin-bottom: 20px;
        }

        .cat-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cat-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(217, 119, 6, 0.18);
          color: #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(251, 191, 36, 0.35);
          flex-shrink: 0;
        }

        .cat-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .cat-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cat-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cat-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
        }

        .cat-name-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cat-color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .cat-name {
          font-weight: 600;
          color: var(--text-main);
        }

        .cat-units-sold {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .cat-values {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cat-amount {
          font-weight: 600;
          color: var(--text-main);
        }

        .cat-share {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          min-width: 42px;
          text-align: right;
        }

        .cat-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
          overflow: hidden;
        }

        .cat-progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
