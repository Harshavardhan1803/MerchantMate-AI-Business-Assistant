import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  trendLabel,
  explanation,
  variant = 'primary',
  badge
}) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const isNeutral = trend === 0 || trend === null;

  return (
    <div className={`glass-panel glass-panel-interactive metric-card metric-card-${variant}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className={`metric-icon-circle variant-${variant}`}>
          <Icon size={19} />
        </div>
      </div>

      <div className="metric-body">
        <div className="metric-value-row">
          <span className="metric-main-value">{value}</span>
          {badge && <span className="metric-extra-badge">{badge}</span>}
        </div>

        {subvalue && (
          <div className="metric-subvalue">{subvalue}</div>
        )}

        <div className="metric-footer">
          {trend !== null && trend !== undefined ? (
            <div className={`trend-pill ${isPositive ? 'trend-up' : isNegative ? 'trend-down' : 'trend-neutral'}`}>
              {isPositive && <ArrowUpRight size={13} />}
              {isNegative && <ArrowDownRight size={13} />}
              {isNeutral && <Minus size={13} />}
              <span className="trend-number">{isPositive ? `+${trend}%` : `${trend}%`}</span>
            </div>
          ) : null}

          <span className="metric-explanation">{explanation || trendLabel}</span>
        </div>
      </div>

      <style>{`
        .metric-card {
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 18px;
          min-height: 160px;
          position: relative;
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .metric-title {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .metric-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .variant-primary {
          background: rgba(251, 191, 36, 0.16);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.35);
        }

        .variant-violet {
          background: rgba(217, 119, 6, 0.16);
          color: #f59e0b;
          border: 1px solid rgba(217, 119, 6, 0.35);
        }

        .variant-cyan {
          background: rgba(180, 83, 9, 0.16);
          color: #ea580c;
          border: 1px solid rgba(180, 83, 9, 0.35);
        }

        .variant-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .metric-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-value-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }

        .metric-main-value {
          font-size: 1.85rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .metric-subvalue {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .metric-extra-badge {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(245, 158, 11, 0.2);
          color: #fde68a;
          border: 1px solid rgba(251, 191, 36, 0.4);
        }

        .metric-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .trend-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .trend-up {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .trend-down {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .trend-neutral {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
        }

        .metric-explanation {
          font-size: 0.76rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
