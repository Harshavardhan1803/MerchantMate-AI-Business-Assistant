import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { Calendar, IndianRupee, ShoppingBag } from 'lucide-react';

export default function SalesTrendChart({ dailyTrend }) {
  const [metricMode, setMetricMode] = useState('revenue'); // 'revenue' | 'orders'

  // Dynamic calculations for footer highlights
  const peakDay = dailyTrend && dailyTrend.length > 0
    ? dailyTrend.reduce((max, d) => d.revenue > (max?.revenue || 0) ? d : max, dailyTrend[0])
    : null;

  const weekendOrders = dailyTrend
    ? dailyTrend.filter(d => d.day === 'Sat' || d.day === 'Sun').reduce((acc, cur) => acc + cur.orders, 0)
    : 0;
  const totalOrders = dailyTrend
    ? dailyTrend.reduce((acc, cur) => acc + cur.orders, 0)
    : 0;
  const weekendOrderShare = totalOrders > 0
    ? ((weekendOrders / totalOrders) * 100).toFixed(1)
    : 0;

  // Custom Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-day">{data.day}, {data.displayDate}</span>
            <span className="tooltip-tag">Daily Record</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">Revenue:</span>
              <span className="tooltip-value highlight">{formatCurrency(data.revenue)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Orders:</span>
              <span className="tooltip-value">{formatNumber(data.orders)} transactions</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Units Sold:</span>
              <span className="tooltip-value">{data.units} items</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Avg Order Value:</span>
              <span className="tooltip-value">{formatCurrency(data.aov)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel chart-container">
      <div className="chart-header">
        <div className="chart-title-area">
          <h3 className="chart-title">7-Day Sales Performance Trend</h3>
          <p className="chart-subtitle">
            Daily order volume and gross revenue across the active sales period
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="chart-toggle-group">
          <button
            className={`chart-toggle-btn ${metricMode === 'revenue' ? 'active' : ''}`}
            onClick={() => setMetricMode('revenue')}
            aria-label="View Revenue Trend"
          >
            <IndianRupee size={14} />
            <span>Revenue (₹)</span>
          </button>
          <button
            className={`chart-toggle-btn ${metricMode === 'orders' ? 'active' : ''}`}
            onClick={() => setMetricMode('orders')}
            aria-label="View Orders Trend"
          >
            <ShoppingBag size={14} />
            <span>Orders</span>
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart 
            data={dailyTrend} 
            margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Soft Gold Gradient for Revenue */}
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#B45309" stopOpacity={0.0} />
              </linearGradient>

              {/* Burnt Amber Gradient for Orders */}
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EA580C" stopOpacity={0.42} />
                <stop offset="95%" stopColor="#78350F" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(245, 158, 11, 0.08)" 
              vertical={false} 
            />

            <XAxis 
              dataKey="day" 
              stroke="#A89278" 
              tick={{ fill: '#D4C3A3', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: 'rgba(245, 158, 11, 0.12)' }}
              tickLine={false}
              dy={8}
            />

            <YAxis 
              stroke="#A89278" 
              tick={{ fill: '#D4C3A3', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => metricMode === 'revenue' ? `₹${Number(val).toLocaleString('en-IN')}` : val}
              dx={-4}
            />

            <Tooltip content={<CustomTooltip />} />

            {metricMode === 'revenue' ? (
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#FBBF24" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
                activeDot={{ 
                  r: 6, 
                  fill: '#D97706', 
                  stroke: '#FDE68A', 
                  strokeWidth: 2,
                  boxShadow: '0 0 12px rgba(251, 191, 36, 0.8)' 
                }}
              />
            ) : (
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#EA580C" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#ordersGradient)" 
                activeDot={{ 
                  r: 6, 
                  fill: '#B45309', 
                  stroke: '#FDE68A', 
                  strokeWidth: 2 
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Highlights */}
      <div className="chart-highlights">
        <div className="highlight-pill">
          <span className="dot dot-weekend"></span>
          <span>Weekend Surge: Sat & Sun drive {weekendOrderShare}% of customer orders</span>
        </div>
        {peakDay && (
          <div className="highlight-pill">
            <span className="dot dot-peak"></span>
            <span>Peak Day: {peakDay.day} ({formatCurrency(peakDay.revenue)})</span>
          </div>
        )}
      </div>

      <style>{`
        .chart-container {
          padding: 24px 28px 20px;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .chart-title-area {
          display: flex;
          flex-direction: column;
        }

        .chart-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .chart-subtitle {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 3px;
        }

        .chart-toggle-group {
          display: flex;
          align-items: center;
          padding: 3px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
        }

        .chart-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .chart-toggle-btn:hover {
          color: var(--text-main);
        }

        .chart-toggle-btn.active {
          background: rgba(217, 119, 6, 0.22);
          color: #fffbeb;
          border: 1px solid rgba(251, 191, 36, 0.45);
          box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
        }

        .chart-wrapper {
          width: 100%;
          margin: 10px 0 16px;
        }

        .chart-tooltip {
          background: rgba(24, 15, 10, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border-light);
          border-radius: 12px;
          padding: 12px 14px;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
          min-width: 190px;
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.12);
          margin-bottom: 8px;
        }

        .tooltip-day {
          font-size: 0.84rem;
          font-weight: 700;
          color: #fffbeb;
        }

        .tooltip-tag {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--primary-light);
          text-transform: uppercase;
        }

        .tooltip-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tooltip-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          gap: 12px;
        }

        .tooltip-label {
          color: var(--text-muted);
        }

        .tooltip-value {
          font-weight: 600;
          color: var(--text-main);
        }

        .tooltip-value.highlight {
          color: #fde68a;
          font-weight: 700;
        }

        .chart-highlights {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(245, 158, 11, 0.08);
          flex-wrap: wrap;
        }

        .highlight-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          color: var(--text-secondary);
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .dot-weekend {
          background: #d97706;
          box-shadow: 0 0 8px #d97706;
        }

        .dot-peak {
          background: #fbbf24;
          box-shadow: 0 0 8px #fbbf24;
        }
      `}</style>
    </div>
  );
}
