import React, { useState, useEffect } from 'react';
import { X, IndianRupee, Sparkles, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../data/salesData';

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSave, 
  productToEdit = null,
  existingCategories = []
}) {
  const isEditing = Boolean(productToEdit);

  const initialFormState = {
    name: '',
    category: 'Beverages',
    customCategory: '',
    price: '',
    cost: '',
    inventory: 30,
    unitsSold: 12,
    sku: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'Beverages',
        customCategory: '',
        price: productToEdit.price !== undefined ? productToEdit.price : '',
        cost: productToEdit.cost !== undefined ? productToEdit.cost : '',
        inventory: productToEdit.inventory !== undefined ? productToEdit.inventory : 30,
        unitsSold: productToEdit.unitsSold !== undefined ? productToEdit.unitsSold : 0,
        sku: productToEdit.sku || '',
        description: productToEdit.description || ''
      });
    } else {
      // Auto-generate random SKU for new product
      const randNum = Math.floor(10 + Math.random() * 90);
      setFormData({
        ...initialFormState,
        sku: `PRD-NEW-${randNum}`
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const priceNum = parseFloat(formData.price) || 0;
  const costNum = parseFloat(formData.cost) || 0;
  const unitsNum = parseInt(formData.unitsSold, 10) || 0;
  const unitProfit = priceNum - costNum;
  const marginPercent = priceNum > 0 ? Number(((unitProfit / priceNum) * 100).toFixed(1)) : 0;
  const totalRevenue = priceNum * unitsNum;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Product name is required';
    }
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      errs.price = 'Enter a valid retail price';
    }
    if (formData.cost === '' || isNaN(formData.cost) || Number(formData.cost) < 0) {
      errs.cost = 'Enter a valid unit cost';
    }
    if (formData.category === 'Custom' && !formData.customCategory.trim()) {
      errs.customCategory = 'Enter custom category name';
    }
    if (formData.inventory === '' || isNaN(formData.inventory) || Number(formData.inventory) < 0) {
      errs.inventory = 'Enter valid stock count';
    }
    if (formData.unitsSold === '' || isNaN(formData.unitsSold) || Number(formData.unitsSold) < 0) {
      errs.unitsSold = 'Enter 7-day units sold';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory = formData.category === 'Custom' 
      ? formData.customCategory.trim() 
      : formData.category;

    const payload = {
      ...(productToEdit || {}),
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: finalCategory,
      price: Number(formData.price),
      cost: Number(formData.cost),
      inventory: Number(formData.inventory),
      unitsSold: Number(formData.unitsSold),
      sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      description: formData.description.trim() || 'Handcrafted store merchandise item.'
    };

    onSave(payload);
    onClose();
  };

  // Category options without "All Categories"
  const catOptions = (existingCategories.length > 0 ? existingCategories : CATEGORIES)
    .filter(c => c !== 'All Categories');

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-wrap">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="modal-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="modal-subtitle">
                {isEditing ? 'Update pricing, margins and stock levels' : 'Add custom merchandise to your shop catalog'}
              </p>
            </div>
          </div>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Calculation Preview Banner */}
        <div className="calc-preview-banner">
          <div className="calc-stat">
            <span className="calc-label">Profit per Unit</span>
            <span className={`calc-val ${unitProfit >= 0 ? 'text-success' : 'text-danger'}`}>
              ₹{unitProfit.toFixed(0)}
            </span>
          </div>
          <div className="calc-divider" />
          <div className="calc-stat">
            <span className="calc-label">Gross Margin</span>
            <span className={`calc-val ${marginPercent >= 30 ? 'text-success' : marginPercent > 0 ? 'text-warning' : 'text-danger'}`}>
              {marginPercent}%
            </span>
          </div>
          <div className="calc-divider" />
          <div className="calc-stat">
            <span className="calc-label">7-Day Projected Sales</span>
            <span className="calc-val text-primary-light">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="name">
                Product Name <span className="req">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Organic Darjeeling First Flush Tea"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {catOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Custom">+ Custom Category...</option>
              </select>
            </div>

            {/* SKU */}
            <div className="form-group">
              <label className="form-label" htmlFor="sku">SKU Code</label>
              <input
                id="sku"
                name="sku"
                type="text"
                className="form-input font-mono"
                placeholder="e.g. BEV-TEA-09"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>

            {/* Custom Category Input if selected */}
            {formData.category === 'Custom' && (
              <div className="form-group full-width">
                <label className="form-label" htmlFor="customCategory">
                  Custom Category Name <span className="req">*</span>
                </label>
                <input
                  id="customCategory"
                  name="customCategory"
                  type="text"
                  className={`form-input ${errors.customCategory ? 'input-error' : ''}`}
                  placeholder="e.g. Artisan Pottery, Gourmet Spices"
                  value={formData.customCategory}
                  onChange={handleChange}
                />
                {errors.customCategory && <span className="error-text">{errors.customCategory}</span>}
              </div>
            )}

            {/* Retail Price (₹) */}
            <div className="form-group">
              <label className="form-label" htmlFor="price">
                Retail Price (₹) <span className="req">*</span>
              </label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="any"
                  min="0"
                  className={`form-input with-prefix ${errors.price ? 'input-error' : ''}`}
                  placeholder="450"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            {/* Unit Cost (₹) */}
            <div className="form-group">
              <label className="form-label" htmlFor="cost">
                Unit Cost (₹) <span className="req">*</span>
              </label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  id="cost"
                  name="cost"
                  type="number"
                  step="any"
                  min="0"
                  className={`form-input with-prefix ${errors.cost ? 'input-error' : ''}`}
                  placeholder="180"
                  value={formData.cost}
                  onChange={handleChange}
                />
              </div>
              {errors.cost && <span className="error-text">{errors.cost}</span>}
            </div>

            {/* Current Stock */}
            <div className="form-group">
              <label className="form-label" htmlFor="inventory">
                Shelf Inventory (Units) <span className="req">*</span>
              </label>
              <input
                id="inventory"
                name="inventory"
                type="number"
                min="0"
                className={`form-input ${errors.inventory ? 'input-error' : ''}`}
                placeholder="30"
                value={formData.inventory}
                onChange={handleChange}
              />
              {errors.inventory && <span className="error-text">{errors.inventory}</span>}
            </div>

            {/* 7-Day Units Sold */}
            <div className="form-group">
              <label className="form-label" htmlFor="unitsSold">
                7-Day Units Sold <span className="req">*</span>
              </label>
              <input
                id="unitsSold"
                name="unitsSold"
                type="number"
                min="0"
                className={`form-input ${errors.unitsSold ? 'input-error' : ''}`}
                placeholder="15"
                value={formData.unitsSold}
                onChange={handleChange}
              />
              {errors.unitsSold && <span className="error-text">{errors.unitsSold}</span>}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="description">Short Description</label>
              <textarea
                id="description"
                name="description"
                rows="2"
                className="form-textarea"
                placeholder="Handcrafted organic product sourced directly from artisanal producers..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
          animation: fadeIn 200ms ease;
        }

        .modal-content {
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px 30px;
          border-radius: 20px;
          background: rgba(24, 15, 10, 0.98);
          border: 1px solid var(--glass-border-light);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.1);
          margin-bottom: 18px;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fbbf24 0%, #b45309 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a0f05;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.45);
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .modal-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 6px;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .modal-close-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.1);
        }

        /* Live Calc Banner */
        .calc-preview-banner {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
        }

        .calc-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .calc-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }

        .calc-val {
          font-size: 1.05rem;
          font-weight: 700;
          margin-top: 2px;
        }

        .calc-divider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.08);
        }

        .text-success { color: #34d399; }
        .text-warning { color: #fbbf24; }
        .text-danger { color: #f87171; }

        /* Form Layout */
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .req {
          color: #f87171;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 9px 12px;
          color: var(--text-main);
          font-family: var(--font-sans);
          font-size: 0.88rem;
          outline: none;
          transition: border-color var(--transition-fast), background var(--transition-fast);
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--primary-light);
          background: rgba(255, 255, 255, 0.07);
        }

        .input-error {
          border-color: rgba(239, 68, 68, 0.6) !important;
        }

        .error-text {
          font-size: 0.72rem;
          color: #f87171;
        }

        .input-prefix-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          font-weight: 600;
          pointer-events: none;
        }

        .with-prefix {
          padding-left: 28px;
        }

        .form-select {
          cursor: pointer;
        }

        .form-select option {
          background: #1a0f05;
          color: #fffbeb;
        }

        .form-textarea {
          resize: vertical;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .calc-preview-banner {
            flex-direction: column;
            gap: 10px;
          }

          .calc-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
