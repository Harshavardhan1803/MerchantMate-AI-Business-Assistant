import React, { useState } from 'react';
import { 
  Menu, 
  Calendar, 
  Sparkles, 
  Bell, 
  Search, 
  ChevronDown, 
  Check, 
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { STORE_INFO } from '../data/salesData';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onMenuToggle, 
  dateRangeFilter, 
  setDateRangeFilter 
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dateOptions = [
    { id: 'all-7-days', label: 'Last 7 Days (Oct 23 - Oct 29)', badge: 'Full Sample' },
    { id: 'weekend-only', label: 'Weekend Peak (Oct 24 - Oct 25)', badge: 'Sat & Sun' },
    { id: 'weekdays-only', label: 'Weekday Trading (5 Days)', badge: 'Mon - Fri' }
  ];

  const currentOption = dateOptions.find(d => d.id === dateRangeFilter) || dateOptions[0];

  const pageTitles = {
    overview: 'Performance Overview',
    products: 'Products & Inventory',
    insights: 'Actionable Sales Insights',
    assistant: 'Ask MerchantMate'
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile menu trigger */}
        <button 
          className="mobile-hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb & Section Name */}
        <div className="breadcrumb-box">
          <span className="breadcrumb-root">MerchantMate</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">{pageTitles[activeTab]}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Date Range Selector Pill */}
        <div className="dropdown-container">
          <button 
            className="date-selector-btn"
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setShowNotifications(false);
            }}
            aria-expanded={showDatePicker}
            aria-label="Select date range"
          >
            <Calendar size={15} className="text-primary-light" />
            <span className="date-selector-label">{currentOption.label}</span>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {showDatePicker && (
            <div className="glass-dropdown date-dropdown">
              <div className="dropdown-title">Filter Analysis Period</div>
              {dateOptions.map(option => (
                <button
                  key={option.id}
                  className={`dropdown-item ${dateRangeFilter === option.id ? 'active' : ''}`}
                  onClick={() => {
                    setDateRangeFilter(option.id);
                    setShowDatePicker(false);
                  }}
                >
                  <div className="dropdown-item-text">
                    <span className="dropdown-item-title">{option.label}</span>
                    <span className="dropdown-item-desc">{option.badge}</span>
                  </div>
                  {dateRangeFilter === option.id && <Check size={16} className="text-primary-light" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Ask MerchantMate CTA */}
        {activeTab !== 'assistant' && (
          <button 
            className="quick-ask-btn"
            onClick={() => setActiveTab('assistant')}
            title="Ask MerchantMate a business question"
          >
            <Sparkles size={14} />
            <span className="quick-ask-text">Ask MerchantMate</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="dropdown-container">
          <button 
            className="nav-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDatePicker(false);
            }}
            aria-label="Notifications"
            title="Recent Store Alerts"
          >
            <Bell size={17} />
            <span className="notification-pulse" />
          </button>

          {showNotifications && (
            <div className="glass-dropdown notifications-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Store Alerts & Activity</span>
                <span className="badge badge-info">2 New</span>
              </div>
              <div className="notification-item">
                <div className="notif-icon-circle success">
                  <TrendingUp size={14} />
                </div>
                <div className="notif-body">
                  <div className="notif-title">Saturday Peak Volume</div>
                  <div className="notif-text">35 orders processed (₹58,300) — highest this week.</div>
                  <span className="notif-time">Oct 24 • Analytics Record</span>
                </div>
              </div>
              <div className="notification-item">
                <div className="notif-icon-circle warning">
                  <HelpCircle size={14} />
                </div>
                <div className="notif-body">
                  <div className="notif-title">Low Volume Alert</div>
                  <div className="notif-text">Stainless Steel Flask units sold is below weekly target.</div>
                  <span className="notif-time">Oct 29 • Recommendation Available</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="profile-pill">
          <div className="profile-avatar">
            <span>PS</span>
          </div>
          <div className="profile-info">
            <span className="profile-name">{STORE_INFO.owner}</span>
            <span className="profile-role">Shop Owner</span>
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          height: var(--topbar-height);
          background: rgba(18, 11, 7, 0.78);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 30;
          gap: 16px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-hamburger-btn {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 8px;
          color: var(--text-main);
          cursor: pointer;
        }

        .breadcrumb-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
        }

        .breadcrumb-root {
          color: var(--text-muted);
          font-weight: 500;
        }

        .breadcrumb-divider {
          color: var(--text-dim);
        }

        .breadcrumb-current {
          color: var(--text-main);
          font-weight: 600;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .dropdown-container {
          position: relative;
        }

        .date-selector-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .date-selector-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--glass-border-light);
          color: var(--text-main);
        }

        .date-selector-label {
          white-space: nowrap;
        }

        .glass-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: rgba(24, 15, 10, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--glass-border-light);
          border-radius: 14px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(251, 191, 36, 0.12);
          z-index: 50;
          overflow: hidden;
          animation: fadeIn 200ms ease;
        }

        .date-dropdown {
          width: 290px;
          padding: 8px;
        }

        .dropdown-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          text-transform: uppercase;
          padding: 6px 10px 8px;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          text-align: left;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-main);
        }

        .dropdown-item.active {
          background: rgba(217, 119, 6, 0.22);
          color: #fffbeb;
        }

        .dropdown-item-text {
          display: flex;
          flex-direction: column;
        }

        .dropdown-item-title {
          font-size: 0.84rem;
          font-weight: 500;
        }

        .dropdown-item-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .quick-ask-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 9px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.25));
          border: 1px solid rgba(251, 191, 36, 0.45);
          color: #fde68a;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .quick-ask-btn:hover {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.35), rgba(217, 119, 6, 0.4));
          color: #fffbeb;
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.4);
          transform: translateY(-1px);
        }

        .nav-icon-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .nav-icon-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }

        .notification-pulse {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 7px;
          height: 7px;
          background: var(--primary-light);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--primary);
        }

        .notifications-dropdown {
          width: 320px;
          padding: 12px;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 10px;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          margin-bottom: 6px;
          transition: background var(--transition-fast);
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .notif-icon-circle {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-icon-circle.success {
          background: var(--success-bg);
          color: #34d399;
        }

        .notif-icon-circle.warning {
          background: var(--warning-bg);
          color: #fbbf24;
        }

        .notif-body {
          display: flex;
          flex-direction: column;
        }

        .notif-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .notif-text {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin: 2px 0 4px;
        }

        .notif-time {
          font-size: 0.68rem;
          color: var(--text-dim);
        }

        .profile-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px 4px 4px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
        }

        .profile-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #b45309);
          color: #1a0f05;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.1;
        }

        .profile-role {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .mobile-hamburger-btn {
            display: flex;
          }

          .navbar {
            padding: 0 16px;
          }

          .date-selector-label {
            display: none;
          }

          .quick-ask-text {
            display: none;
          }

          .profile-info {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
