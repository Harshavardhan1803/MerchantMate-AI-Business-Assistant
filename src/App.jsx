import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import OverviewPage from './pages/OverviewPage';
import ProductsPage from './pages/ProductsPage';
import InsightsPage from './pages/InsightsPage';
import AssistantPage from './pages/AssistantPage';

import { 
  SAMPLE_PRODUCTS, 
  DAILY_SALES, 
  PREVIOUS_PERIOD_STATS,
  STORE_INFO 
} from './data/salesData';

import { 
  calculateProductMetrics, 
  calculateDailyTrend, 
  calculateDashboardSummary, 
  calculateCategoryBreakdown 
} from './utils/calculations';

// LocalStorage Keys for persistent custom products
const STORAGE_KEY_PRODUCTS = 'merchantmate_custom_products_v1';
const STORAGE_KEY_SALES = 'merchantmate_custom_sales_v1';

function getInitialProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load products from localStorage:', e);
  }
  return SAMPLE_PRODUCTS;
}

function getInitialSales() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SALES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load sales from localStorage:', e);
  }
  return DAILY_SALES;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'insights' | 'assistant'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState('all-7-days');

  // Dynamic Store Products and Sales Records (Editable & Persisted)
  const [products, setProducts] = useState(getInitialProducts);
  const [salesRecords, setSalesRecords] = useState(getInitialSales);

  // Auto-sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to persist products:', e);
    }
  }, [products]);

  // Auto-sync salesRecords to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(salesRecords));
    } catch (e) {
      console.warn('Failed to persist sales records:', e);
    }
  }, [salesRecords]);

  // 1. Add Product Handler
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);

    // Distribute the new product's units sold across the 7 days of sales
    // Day distribution weights [Fri, Sat, Sun, Mon, Tue, Wed, Thu]
    const weights = [0.12, 0.22, 0.18, 0.08, 0.10, 0.14, 0.16];
    const totalUnits = newProduct.unitsSold || 0;

    setSalesRecords(prevSales => {
      return prevSales.map((dayRecord, idx) => {
        const dayUnits = Math.round(totalUnits * weights[idx]);
        return {
          ...dayRecord,
          productSales: {
            ...(dayRecord.productSales || {}),
            [newProduct.id]: dayUnits
          }
        };
      });
    });
  };

  // 2. Edit Product Handler
  const handleEditProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    // If units sold changed, update the 7-day distribution
    const weights = [0.12, 0.22, 0.18, 0.08, 0.10, 0.14, 0.16];
    const totalUnits = updatedProduct.unitsSold || 0;

    setSalesRecords(prevSales => {
      return prevSales.map((dayRecord, idx) => {
        const dayUnits = Math.round(totalUnits * weights[idx]);
        return {
          ...dayRecord,
          productSales: {
            ...(dayRecord.productSales || {}),
            [updatedProduct.id]: dayUnits
          }
        };
      });
    });
  };

  // 3. Delete Product Handler
  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));

    // Clean up product from sales logs
    setSalesRecords(prevSales => {
      return prevSales.map(dayRecord => {
        const updatedProductSales = { ...(dayRecord.productSales || {}) };
        delete updatedProductSales[productId];
        return {
          ...dayRecord,
          productSales: updatedProductSales
        };
      });
    });
  };

  // 4. Reset to Initial Sample Dataset
  const handleResetCatalog = () => {
    setProducts(SAMPLE_PRODUCTS);
    setSalesRecords(DAILY_SALES);
    try {
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_SALES);
    } catch (e) {}
  };

  // Filter raw daily sales based on active date range
  const filteredDailySales = useMemo(() => {
    switch (dateRangeFilter) {
      case 'weekend-only':
        return salesRecords.filter(d => d.day === 'Sat' || d.day === 'Sun');
      case 'weekdays-only':
        return salesRecords.filter(d => d.day !== 'Sat' && d.day !== 'Sun');
      case 'all-7-days':
      default:
        return salesRecords;
    }
  }, [dateRangeFilter, salesRecords]);

  // Reactive business intelligence calculations
  const productMetrics = useMemo(() => {
    return calculateProductMetrics(products, filteredDailySales);
  }, [products, filteredDailySales]);

  const dailyTrend = useMemo(() => {
    return calculateDailyTrend(filteredDailySales, products);
  }, [filteredDailySales, products]);

  const summary = useMemo(() => {
    const comparisonBaseline = dateRangeFilter === 'all-7-days' ? PREVIOUS_PERIOD_STATS : null;
    return calculateDashboardSummary(dailyTrend, productMetrics, comparisonBaseline);
  }, [dailyTrend, productMetrics, dateRangeFilter]);

  const categories = useMemo(() => {
    return calculateCategoryBreakdown(productMetrics);
  }, [productMetrics]);

  // Combined dataset bundle passed to the Assistant
  const assistantDataset = useMemo(() => ({
    products,
    dailySales: filteredDailySales,
    previousPeriodStats: dateRangeFilter === 'all-7-days' ? PREVIOUS_PERIOD_STATS : null
  }), [products, filteredDailySales, dateRangeFilter]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === '1') setActiveTab('overview');
      if (e.key === '2') setActiveTab('products');
      if (e.key === '3') setActiveTab('insights');
      if (e.key === '4') setActiveTab('assistant');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onMenuToggle={() => setMobileMenuOpen(prev => !prev)}
          dateRangeFilter={dateRangeFilter}
          setDateRangeFilter={setDateRangeFilter}
        />

        {/* Active Page View */}
        <main className="page-wrapper" id="main-content">
          {activeTab === 'overview' && (
            <OverviewPage
              summary={summary}
              dailyTrend={dailyTrend}
              categories={categories}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'products' && (
            <ProductsPage
              productMetrics={productMetrics}
              summary={summary}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onResetCatalog={handleResetCatalog}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsPage
              summary={summary}
              dailyTrend={dailyTrend}
              productMetrics={productMetrics}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantPage
              dataset={assistantDataset}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-left">
              <span className="footer-brand">MerchantMate</span>
              <span className="footer-dot">•</span>
              <span className="footer-tagline">{STORE_INFO.tagline}</span>
            </div>
            <div className="footer-right">
              <span>Interactive React + Vite MVP</span>
              <span className="footer-dot">•</span>
              <span>Live LocalStorage Persistence</span>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .app-footer {
          margin-top: auto;
          padding: 20px 36px;
          border-top: 1px solid var(--glass-border);
          background: rgba(10, 15, 28, 0.4);
        }

        .footer-content {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-dim);
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-left, .footer-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-brand {
          font-weight: 600;
          color: var(--text-muted);
        }

        .footer-dot {
          color: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .app-footer {
            padding: 16px 20px;
          }

          .footer-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
