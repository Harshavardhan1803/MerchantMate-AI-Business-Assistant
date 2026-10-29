import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  MessageSquareText, 
  Store, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { STORE_INFO } from '../data/salesData';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  mobileOpen,
  setMobileOpen 
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Performance metrics & 7-day trend'
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: '8 Items',
      desc: 'Catalog, margins & performance'
    },
    {
      id: 'insights',
      label: 'Sales Insights',
      icon: TrendingUp,
      badge: '3 Actions',
      desc: 'Actionable business recommendations'
    },
    {
      id: 'assistant',
      label: 'Ask MerchantMate',
      icon: MessageSquareText,
      badge: 'AI Demo',
      desc: 'Interactive business Q&A assistant'
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-lockup">
            <div className="brand-icon-wrapper">
              <Sparkles className="brand-sparkle" size={20} />
            </div>
            {!isCollapsed && (
              <div className="brand-text">
                <span className="brand-name">MerchantMate</span>
                <span className="brand-tagline">AI Business Assistant</span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button 
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Store Indicator Pill */}
        {!isCollapsed && (
          <div className="store-pill">
            <div className="store-pill-icon">
              <Store size={14} />
            </div>
            <div className="store-pill-info">
              <span className="store-name">{STORE_INFO.name}</span>
              <span className="store-status">
                <span className="status-dot"></span> Live Store Data
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <div className="nav-section-label">
            {!isCollapsed ? 'ANALYTICS & ADVISORY' : '•••'}
          </div>

          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id} className="nav-item">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="nav-icon-container">
                      <Icon size={19} className="nav-icon" />
                    </div>

                    {!isCollapsed && (
                      <div className="nav-btn-content">
                        <span className="nav-label">{item.label}</span>
                        {item.badge && (
                          <span className={`nav-badge ${item.id === 'assistant' ? 'nav-badge-ai' : ''}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {isActive && <div className="nav-active-glow" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {!isCollapsed ? (
            <div className="footer-card">
              <div className="footer-card-header">
                <ShieldCheck size={16} className="text-primary-light" />
                <span className="footer-plan-label">{STORE_INFO.plan}</span>
              </div>
              <p className="footer-card-desc">
                "Your business, made easier to understand."
              </p>
            </div>
          ) : null}

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapse-toggle-btn"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          min-height: 100vh;
          background: rgba(18, 11, 7, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 40;
          transition: width var(--transition-normal);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }

        .sidebar-header {
          padding: 22px 20px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(245, 158, 11, 0.08);
        }

        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .brand-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fbbf24 0%, #b45309 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a0f05;
          box-shadow: 0 4px 16px rgba(217, 119, 6, 0.45);
          flex-shrink: 0;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .brand-name {
          font-weight: 700;
          font-size: 1.15rem;
          color: #fffbeb;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .brand-tagline {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .mobile-close-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }

        .store-pill {
          margin: 16px 16px 8px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(245, 158, 11, 0.04);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .store-pill-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(217, 119, 6, 0.2);
          color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .store-pill-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .store-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .store-status {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 8px var(--success);
          display: inline-block;
        }

        .sidebar-nav {
          flex: 1;
          padding: 14px 12px;
        }

        .nav-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-dim);
          padding: 6px 10px 10px;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .nav-btn:hover {
          background: rgba(245, 158, 11, 0.07);
          color: var(--text-main);
        }

        .nav-btn.active {
          background: rgba(217, 119, 6, 0.18);
          border-color: rgba(251, 191, 36, 0.45);
          color: #fffbeb;
          box-shadow: 0 4px 18px rgba(217, 119, 6, 0.28);
        }

        .nav-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }

        .nav-btn:hover .nav-icon-container {
          transform: scale(1.08);
        }

        .nav-btn.active .nav-icon {
          color: var(--primary-light);
        }

        .nav-btn-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 0;
        }

        .nav-label {
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-badge {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(245, 158, 11, 0.12);
          color: var(--text-secondary);
        }

        .nav-badge-ai {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.25));
          color: #fde68a;
          border: 1px solid rgba(251, 191, 36, 0.45);
        }

        .nav-active-glow {
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          border-radius: 0 4px 4px 0;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary);
        }

        .sidebar-footer {
          padding: 16px 14px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-card {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid var(--glass-border);
        }

        .footer-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .footer-plan-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-light);
          letter-spacing: 0.04em;
        }

        .footer-card-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-style: italic;
          line-height: 1.4;
        }

        .collapse-toggle-btn {
          align-self: center;
          width: 100%;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .collapse-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }

        /* Mobile Responsive */
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.75);
          backdrop-filter: blur(4px);
          z-index: 45;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            transition: transform var(--transition-smooth);
            z-index: 50;
            width: 280px !important;
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .mobile-close-btn {
            display: block;
          }

          .collapse-toggle-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
