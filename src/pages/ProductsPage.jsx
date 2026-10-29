import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Award, 
  AlertTriangle, 
  LayoutGrid, 
  Table as TableIcon,
  CheckCircle2,
  TrendingUp,
  Tag,
  IndianRupee,
  PackageCheck,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/salesData';
import { formatCurrency, formatNumber } from '../utils/calculations';
import ProductModal from '../components/ProductModal';

export default function ProductsPage({ 
  productMetrics, 
  summary,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onResetCatalog,
  existingCategories = CATEGORIES
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('revenue-desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Delete confirmation state
  const [productToDelete, setProductToDelete] = useState(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (productToEdit) {
      if (onEditProduct) onEditProduct(productData);
      showToast(`Updated "${productData.name}" successfully.`);
    } else {
      if (onAddProduct) onAddProduct(productData);
      showToast(`Added "${productData.name}" to catalog.`);
    }
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const name = productToDelete.name;
    if (onDeleteProduct) onDeleteProduct(productToDelete.id);
    showToast(`Removed "${name}" from store.`);
    setProductToDelete(null);
  };

  // Lowest performing product by units sold
  const lowestPerformer = summary.lowestPerformer;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productMetrics
      .filter((product) => {
        const matchesCategory = 
          selectedCategory === 'All Categories' || 
          product.category === selectedCategory;

        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'revenue-desc':
            return b.revenue - a.revenue;
          case 'revenue-asc':
            return a.revenue - b.revenue;
          case 'units-desc':
            return b.unitsSold - a.unitsSold;
          case 'units-asc':
            return a.unitsSold - b.unitsSold;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-desc':
            return b.price - a.price;
          default:
            return b.revenue - a.revenue;
        }
      });
  }, [productMetrics, selectedCategory, searchTerm, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSortBy('revenue-desc');
  };

  // Categories list including any dynamically added categories
  const dynamicCategories = useMemo(() => {
    const set = new Set(['All Categories']);
    productMetrics.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [productMetrics]);

  return (
    <div className="products-page fade-in">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={16} className="text-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            Products & Inventory Management
          </h1>
          <p className="page-header-subtitle">
            Catalog-level financial breakdown, sales volume rankings, and live inventory control
          </p>
        </div>

        {/* Header Actions: Add Product & View Toggle */}
        <div className="header-actions-group">
          {onResetCatalog && (
            <button
              className="btn btn-ghost reset-btn"
              onClick={onResetCatalog}
              title="Reset catalog back to sample dataset"
            >
              <RotateCcw size={14} />
              <span className="reset-btn-text">Reset Demo</span>
            </button>
          )}

          <button
            className="btn btn-primary add-product-btn"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>

          <div className="view-toggle-group">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              title="Table View"
            >
              <TableIcon size={16} />
              <span>Table</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid Cards View"
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 & Lowest Performer Highlight Banners */}
      <div className="highlights-row">
        {/* Top 3 Card */}
        <div className="glass-panel highlight-stat-card">
          <div className="highlight-stat-header">
            <div className="icon-badge gold">
              <Award size={18} />
            </div>
            <div>
              <span className="highlight-stat-tag">Top 3 Revenue Drivers</span>
              <h4 className="highlight-stat-title">{summary.topThreeShare}% of Gross Sales</h4>
            </div>
          </div>
          <p className="highlight-stat-desc">
            Led by <strong>{summary.topThreeProducts[0]?.name || 'N/A'}</strong>, followed by <strong>{summary.topThreeProducts[1]?.name || 'N/A'}</strong> and <strong>{summary.topThreeProducts[2]?.name || 'N/A'}</strong>.
          </p>
        </div>

        {/* Lowest Performer Card */}
        <div className="glass-panel highlight-stat-card border-warning">
          <div className="highlight-stat-header">
            <div className="icon-badge amber">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="highlight-stat-tag text-amber">Lowest Volume Item</span>
              <h4 className="highlight-stat-title">{lowestPerformer ? lowestPerformer.name : 'N/A'}</h4>
            </div>
          </div>
          <p className="highlight-stat-desc">
            Generated only <strong>{lowestPerformer?.unitsSold || 0} units</strong> ({formatCurrency(lowestPerformer?.revenue || 0)}). Recommended action: bundle with high-velocity anchors.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="glass-panel filter-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="category-chips-scroll">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="sort-dropdown-container">
          <ArrowUpDown size={15} className="sort-icon" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products by"
          >
            <option value="revenue-desc">Sort by: Revenue (High to Low)</option>
            <option value="revenue-asc">Sort by: Revenue (Low to High)</option>
            <option value="units-desc">Sort by: Units Sold (High to Low)</option>
            <option value="units-asc">Sort by: Units Sold (Low to High)</option>
            <option value="price-desc">Sort by: Price (High to Low)</option>
            <option value="name-asc">Sort by: Name (A - Z)</option>
            <option value="name-desc">Sort by: Name (Z - A)</option>
          </select>
        </div>
      </div>

      {/* Products Display (Table or Grid) */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-icon-wrap">
            <Search size={28} />
          </div>
          <h3 className="empty-title">No matching products found</h3>
          <p className="empty-desc">
            {productMetrics.length === 0 
              ? 'Your catalog is empty. Click "+ Add Product" above to create your first item!'
              : `We couldn't find any products matching "${searchTerm}" in category "${selectedCategory}".`
            }
          </p>
          {productMetrics.length === 0 ? (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Your First Product</span>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={clearFilters}>
              Reset Search & Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel table-panel">
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Rank</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Units Sold</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Gross Profit</th>
                  <th className="text-center">Performance</th>
                  <th className="text-center" style={{ width: '90px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isLowest = product.id === lowestPerformer?.id;

                  return (
                    <tr 
                      key={product.id}
                      className={`product-row ${isLowest ? 'row-lowest' : ''}`}
                    >
                      {/* Rank Badge */}
                      <td>
                        <span className={`rank-badge ${product.rank <= 3 ? `rank-${product.rank}` : 'rank-other'}`}>
                          {product.rank}
                        </span>
                      </td>

                      {/* Product Name & SKU */}
                      <td>
                        <div className="product-identity">
                          <span className="product-name">{product.name}</span>
                          <span className="product-sku">{product.sku}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="category-pill">{product.category}</span>
                      </td>

                      {/* Unit Price */}
                      <td className="text-right font-mono font-medium">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Units Sold */}
                      <td className="text-right font-mono">
                        <span className="units-count">{product.unitsSold}</span>
                        <span className="units-label">units</span>
                      </td>

                      {/* Gross Revenue & Share */}
                      <td className="text-right">
                        <div className="revenue-cell">
                          <span className="revenue-val font-mono">{formatCurrency(product.revenue)}</span>
                          <span className="revenue-share">{product.revenueShare}% share</span>
                        </div>
                      </td>

                      {/* Profit Margin */}
                      <td className="text-right">
                        <div className="profit-cell">
                          <span className="profit-val font-mono">{formatCurrency(product.grossProfit)}</span>
                          <span className="profit-margin">{product.profitMargin}% margin</span>
                        </div>
                      </td>

                      {/* Performance Status Badge */}
                      <td className="text-center">
                        <span className={`badge badge-${product.statusTone}`}>
                          {product.performanceStatus}
                        </span>
                      </td>

                      {/* Actions (Edit & Delete) */}
                      <td className="text-center">
                        <div className="table-actions-cell">
                          <button
                            className="row-action-btn edit"
                            onClick={() => handleOpenEdit(product)}
                            title="Edit product details"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="row-action-btn delete"
                            onClick={() => setProductToDelete(product)}
                            title="Delete product"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const isLowest = product.id === lowestPerformer?.id;

            return (
              <div 
                key={product.id} 
                className={`glass-panel glass-panel-interactive product-card ${isLowest ? 'border-warning' : ''}`}
              >
                <div className="card-top">
                  <div className="card-top-left">
                    <span className={`rank-badge ${product.rank <= 3 ? `rank-${product.rank}` : 'rank-other'}`}>
                      #{product.rank}
                    </span>
                    <span className="category-pill">{product.category}</span>
                  </div>
                  <span className={`badge badge-${product.statusTone}`}>
                    {product.performanceStatus}
                  </span>
                </div>

                <div className="card-mid">
                  <h3 className="card-product-name">{product.name}</h3>
                  <span className="card-product-sku">{product.sku}</span>
                  <p className="card-product-desc">{product.description}</p>
                </div>

                <div className="card-metrics-grid">
                  <div className="card-metric-box">
                    <span className="card-metric-label">Unit Price</span>
                    <span className="card-metric-val font-mono">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="card-metric-box">
                    <span className="card-metric-label">Units Sold</span>
                    <span className="card-metric-val font-mono">{product.unitsSold}</span>
                  </div>
                  <div className="card-metric-box">
                    <span className="card-metric-label">Gross Revenue</span>
                    <span className="card-metric-val font-mono text-primary-light">{formatCurrency(product.revenue)}</span>
                  </div>
                  <div className="card-metric-box">
                    <span className="card-metric-label">Profit Margin</span>
                    <span className="card-metric-val font-mono text-emerald">{product.profitMargin}%</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="card-share-text">
                    Generates <strong>{product.revenueShare}%</strong> of 7-day store revenue
                  </span>

                  {/* Card Edit & Delete actions */}
                  <div className="card-actions-row">
                    <button
                      className="card-action-btn edit"
                      onClick={() => handleOpenEdit(product)}
                      title="Edit Product"
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="card-action-btn delete"
                      onClick={() => setProductToDelete(product)}
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        existingCategories={dynamicCategories}
      />

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <div 
          className="modal-backdrop"
          onClick={() => setProductToDelete(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <AlertTriangle size={24} className="text-warning" />
            </div>
            <h3 className="confirm-title">Delete Product?</h3>
            <p className="confirm-desc">
              Are you sure you want to remove <strong>"{productToDelete.name}"</strong>? This will permanently delete it from your catalog and recalculate all 7-day revenue, rankings, and sales trends.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger-solid"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={15} />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .products-page {
          display: flex;
          flex-direction: column;
          gap: 22px;
          position: relative;
        }

        /* Toast */
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 28px;
          background: rgba(24, 15, 10, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(245, 158, 11, 0.45);
          color: #fffbeb;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 16px rgba(217, 119, 6, 0.3);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 500;
          z-index: 120;
          animation: slideUp 250ms ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .add-product-btn {
          box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4);
        }

        .reset-btn {
          font-size: 0.8rem;
          padding: 7px 12px;
        }

        .view-toggle-group {
          display: flex;
          align-items: center;
          padding: 3px;
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .view-btn.active {
          background: rgba(217, 119, 6, 0.22);
          color: #fffbeb;
          border: 1px solid rgba(251, 191, 36, 0.45);
        }

        .highlights-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .highlight-stat-card {
          padding: 20px 24px;
          border-radius: 16px;
        }

        .highlight-stat-card.border-warning {
          border-color: rgba(245, 158, 11, 0.3);
        }

        .highlight-stat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-badge.gold {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .icon-badge.amber {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .highlight-stat-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .highlight-stat-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .text-amber {
          color: #fbbf24 !important;
        }

        .highlight-stat-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        /* Filter Bar */
        .filter-bar {
          padding: 14px 18px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 260px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 9px 36px 9px 36px;
          color: var(--text-main);
          font-family: var(--font-sans);
          font-size: 0.86rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .search-input:focus {
          border-color: var(--primary-light);
          background: rgba(255, 255, 255, 0.07);
        }

        .clear-search-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .category-chips-scroll {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .category-chip {
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .category-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }

        .category-chip.active {
          background: rgba(217, 119, 6, 0.22);
          color: #fffbeb;
          border-color: rgba(251, 191, 36, 0.45);
        }

        .sort-dropdown-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sort-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .sort-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 8px 16px 8px 34px;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          cursor: pointer;
          outline: none;
        }

        /* Products Table */
        .table-panel {
          border-radius: 18px;
          overflow: hidden;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .products-table th {
          padding: 16px 20px;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.015);
        }

        .products-table td {
          padding: 16px 20px;
          font-size: 0.86rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }

        .product-row:hover {
          background: rgba(255, 255, 255, 0.025);
        }

        .product-row.row-lowest {
          background: rgba(245, 158, 11, 0.03);
        }

        .rank-other {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
        }

        .product-identity {
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-weight: 600;
          color: var(--text-main);
        }

        .product-sku {
          font-size: 0.72rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        .category-pill {
          display: inline-block;
          font-size: 0.74rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid var(--glass-border);
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-mono { font-family: var(--font-mono); }
        .font-medium { font-weight: 500; }

        .units-count {
          font-weight: 600;
          color: var(--text-main);
        }

        .units-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-left: 4px;
        }

        .revenue-cell, .profit-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .revenue-val, .profit-val {
          font-weight: 600;
          color: var(--text-main);
        }

        .revenue-share, .profit-margin {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        /* Action Buttons in Table */
        .table-actions-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .row-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .row-action-btn.edit:hover {
          background: rgba(245, 158, 11, 0.22);
          border-color: rgba(251, 191, 36, 0.45);
          color: #fde68a;
        }

        .row-action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          color: #f87171;
        }

        /* Products Grid Mode */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .product-card {
          padding: 22px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-top-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-mid {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-product-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .card-product-sku {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--text-dim);
        }

        .card-product-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-top: 6px;
        }

        .card-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px;
        }

        .card-metric-box {
          display: flex;
          flex-direction: column;
        }

        .card-metric-label {
          font-size: 0.68rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .card-metric-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .text-primary-light { color: var(--primary-light) !important; }
        .text-emerald { color: #34d399 !important; }

        .card-footer {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-share-text {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .card-actions-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .card-action-btn.edit:hover {
          background: rgba(245, 158, 11, 0.2);
          border-color: rgba(251, 191, 36, 0.45);
          color: #fffbeb;
        }

        .card-action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.18);
          border-color: rgba(239, 68, 68, 0.35);
          color: #fca5a5;
        }

        /* Confirmation Dialog */
        .confirm-dialog {
          width: 100%;
          max-width: 440px;
          padding: 26px 28px;
          border-radius: 18px;
          background: rgba(24, 15, 10, 0.98);
          border: 1px solid rgba(245, 158, 11, 0.25);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
        }

        .confirm-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: rgba(245, 158, 11, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .confirm-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .confirm-desc strong {
          color: var(--text-main);
        }

        .confirm-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          margin-top: 6px;
        }

        .btn-danger-solid {
          background: #ef4444;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
        }

        .btn-danger-solid:hover {
          background: #dc2626;
        }

        /* Empty State */
        .empty-state {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          border-radius: 18px;
        }

        .empty-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .empty-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .empty-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          max-width: 440px;
        }

        @media (max-width: 900px) {
          .highlights-row {
            grid-template-columns: 1fr;
          }

          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input-wrapper {
            min-width: 100%;
          }

          .reset-btn-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
