import React from 'react';
import { 
  IndianRupee, 
  ShoppingBag, 
  CreditCard, 
  Award, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import SalesTrendChart from '../components/SalesTrendChart';
import CategoryChart from '../components/CategoryChart';
import { formatCurrency, formatNumber } from '../utils/calculations';

export default function OverviewPage({ 
  summary, 
  dailyTrend, 
  categories, 
  setActiveTab 
}) {
  const bestSeller = summary.bestSellerByRevenue;
  const lowestPerformer = summary.lowestPerformer;

  return (
    <div className="overview-page fade-in">
      {/* Page Title & Subtitle */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            Business Overview
          </h1>
          <p className="page-header-subtitle">
            Real-time sales health, volume trends, and revenue composition for Artisan & Co.
          </p>
        </div>

        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('assistant')}
          >
            <Sparkles size={16} />
            <span>Ask MerchantMate</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          icon={IndianRupee}
          trend={summary.growth.revenue}
          trendLabel="vs previous 7 days"
          explanation="Gross receipts across all 8 products"
          variant="primary"
        />

        <MetricCard
          title="Total Orders"
          value={formatNumber(summary.totalOrders)}
          subvalue={`${formatNumber(summary.totalUnits)} units sold`}
          icon={ShoppingBag}
          trend={summary.growth.orders}
          trendLabel="vs previous 7 days"
          explanation="Customer checkout transactions"
          variant="cyan"
        />

        <MetricCard
          title="Average Order Value"
          value={formatCurrency(summary.averageOrderValue)}
          subvalue="Revenue ÷ Orders"
          icon={CreditCard}
          trend={summary.growth.aov}
          trendLabel="vs previous 7 days"
          explanation="Avg basket size per customer"
          variant="violet"
        />

        <MetricCard
          title="Best-Selling Product"
          value={bestSeller ? bestSeller.name : 'N/A'}
          subvalue={bestSeller ? `${formatCurrency(bestSeller.revenue)} (${bestSeller.unitsSold} units)` : ''}
          icon={Award}
          trend={null}
          badge="Top Performer"
          explanation={bestSeller ? `${bestSeller.revenueShare}% of all store revenue` : ''}
          variant="emerald"
        />
      </div>

      {/* Main Visualizations Grid */}
      <div className="visuals-grid">
        <div className="visual-chart-col">
          <SalesTrendChart dailyTrend={dailyTrend} />
        </div>
        <div className="visual-category-col">
          <CategoryChart categories={categories} />
        </div>
      </div>

      {/* Quick Action Banners */}
      <div className="overview-banners-grid">
        {/* Banner 1: Top Driver */}
        <div className="glass-panel quick-banner">
          <div className="banner-icon success">
            <TrendingUp size={20} />
          </div>
          <div className="banner-content">
            <h4 className="banner-title">Revenue Concentration</h4>
            <p className="banner-text">
              Your top 3 products generate <strong className="text-light">{summary.topThreeShare}%</strong> of weekly sales. Protect inventory against stockouts.
            </p>
          </div>
          <button 
            className="btn btn-ghost banner-btn"
            onClick={() => setActiveTab('insights')}
          >
            <span>View Insights</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Banner 2: Underperforming Alert */}
        <div className="glass-panel quick-banner">
          <div className="banner-icon warning">
            <AlertCircle size={20} />
          </div>
          <div className="banner-content">
            <h4 className="banner-title">Slow-Moving Inventory Alert</h4>
            <p className="banner-text">
              <strong className="text-light">{lowestPerformer?.name}</strong> moved only {lowestPerformer?.unitsSold} units this week. Consider bundle promotions.
            </p>
          </div>
          <button 
            className="btn btn-ghost banner-btn"
            onClick={() => setActiveTab('products')}
          >
            <span>Inspect Catalog</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .overview-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .visuals-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          align-items: stretch;
        }

        .visual-chart-col, .visual-category-col {
          display: flex;
          flex-direction: column;
        }

        .overview-banners-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .quick-banner {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-radius: 16px;
        }

        .banner-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .banner-icon.success {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .banner-icon.warning {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .banner-content {
          flex: 1;
        }

        .banner-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 3px;
        }

        .banner-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .text-light {
          color: var(--text-main);
        }

        .banner-btn {
          font-size: 0.8rem;
          padding: 7px 12px;
        }

        @media (max-width: 1200px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .visuals-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .overview-banners-grid {
            grid-template-columns: 1fr;
          }

          .quick-banner {
            flex-direction: column;
            align-items: flex-start;
          }

          .banner-btn {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
