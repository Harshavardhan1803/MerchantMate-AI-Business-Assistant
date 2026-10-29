# MerchantMate — Premium AI Business Assistant

> *"Your business, made easier to understand."*

MerchantMate is a high-performance web application designed for small business and retail shop owners. It transforms raw transactional sales data into clear visual analytics, grounded business recommendations, and an interactive Q&A assistant — all packaged in an ultra-modern liquid-glass interface.

Designed as an interview-ready, production-grade portfolio project built with **React**, **Vite**, **Recharts**, and **Lucide React**.

---

## 🌟 Key Application Features

### 1. 📊 Executive Overview Dashboard
- **4 Key Performance Summary Cards**:
  - **Total Revenue**: Calculated sum of all product quantities multiplied by unit prices (₹2,79,090).
  - **Total Orders**: Total customer transactions processed (174 orders) and units sold (483 units).
  - **Average Order Value (AOV)**: Revenue divided by total transactions (₹1,603.97/order).
  - **Best-Selling Product**: Identified hero product with gross revenue and sales share (*Artisan Dark Roast Coffee*).
- **Interactive 7-Day Performance Trend**:
  - Recharts Area chart with smooth Bézier curves and subtle translucent gradient glow.
  - Seamless toggle between **Revenue (₹)** and **Order Volume**.
  - Custom liquid-glass tooltips displaying daily revenue, transaction count, units, and AOV.
- **Category Revenue Share Visualizer**:
  - Contribution distribution across catalog departments (Beverages, Home Goods, Accessories, Stationery, Personal Care).
- **Period Filter**:
  - Switch between *Last 7 Days*, *Weekend Peak*, and *Weekday Trading* to recalculate the dashboard dynamically.

### 2. 📦 Products & Live Catalog Management
- **Full Store Owner CRUD Controls**:
  - **Add Products**: Modal form with live calculations for unit profit, profit margin %, and 7-day projected revenue.
  - **Edit Products**: Update price, cost, inventory count, units sold, and descriptions with real-time recalculation across all dashboard analytics.
  - **Delete Products**: Remove unwanted items with a safety confirmation dialog.
  - **LocalStorage Persistence**: All additions, edits, and deletions persist across page reloads.
  - **Reset Demo Catalog**: One-click restore button to revert back to the default sample dataset at any time.
- **Complete Metric Columns**:
  - SKU & Product Name
  - Category
  - Unit Price (₹) & Cost (₹)
  - Units Sold (7-Day Volume)
  - Gross Revenue & Revenue Share %
  - Gross Profit & Profit Margin %
  - Performance Status Badge (*Top Performer*, *Strong Growth*, *Steady*, *Needs Attention*)
  - Quick Action Buttons (Edit & Delete)
- **Top 3 & Lowest Performer Indicators**:
  - Gold, Silver, and Bronze rank badges for top revenue generators.
  - Alert banner identifying the lowest volume item with immediate merchandising recommendations.
- **Fast Search & Multi-Criteria Filtering**:
  - Real-time search across product names, categories, and SKUs.
  - Dynamic category pill filter bar supporting custom-created categories.
  - Sort by Revenue, Units Sold, Unit Price, or Product Name (A–Z / Z–A).
- **View Toggle**: Switch effortlessly between **Table View** and **Grid Cards View**.

### 3. 💡 Grounded Sales Insights
Every recommendation is calculated directly from the underlying dataset:
1. **Revenue Concentration & Core Driver Protection**:
   - *Data Proof*: Top 3 products account for **52.5%** of total store revenue (₹1,46,400).
   - *Action Plan*: Establish reorder safety buffers to prevent high-impact stockouts before weekend peaks.
2. **Underperforming Inventory Velocity & Cross-Selling**:
   - *Data Proof*: Stainless Steel Flask moved 37 units (lowest volume mover) while Neem & Honey Soap generated ₹9,900.
   - *Action Plan*: Bundle slower-moving items with high-velocity coffee as a "Morning Routine" kit or point-of-sale impulse addition.
3. **Weekend Surge & Basket Optimization**:
   - *Data Proof*: Saturday and Sunday generate **38.7%** of weekly revenue with higher AOV (₹1,637.58 vs ₹1,583.43).
   - *Action Plan*: Optimize staffing during Saturday 11 AM – 4 PM peak foot-traffic hours (35 orders, ₹58,300).
- **Transparent Math Proof Drawer**: Click *"View Calculation & Data Proof"* on any card to view exact formulas, figures, and data references.
- **Interactive Action Checklist**: Mark recommendations as "Implemented" or "To Do".

### 4. 🤖 Ask MerchantMate (Interactive Assistant)
- **Natural Language Question Interface**:
  - Suggested question chips with one-click execution.
  - Real-time conversational message thread with typing indicator.
  - Formatted response cards featuring key stat callouts, itemized dataset breakdowns, and concrete merchant actions.
- **Supported Query Capabilities**:
  - *"What is my total revenue?"*
  - *"Which product generates the most revenue?"*
  - *"Which product sells the least?"*
  - *"Which products should I focus on?"*
  - *"Summarize my sales performance."*
  - *"What is my average order value?"*
  - *"What was my best sales day?"*
  - Any custom merchant query with helpful fallback analytics.
- **Modular Architecture**: Decoupled `queryEngine.js` ready for drop-in LLM integration (Google Gemini API / OpenAI API).
- **Honest Labeling**: Explicitly identified as a deterministic, client-side demo assistant.

---

## 🎨 Design System: Heritage Amber & Soft Gold

- **Signature Palette**:
  - **Soft Gold** (`#FBBF24`, `#FDE68A`): Used for primary highlights, rank badges, active glows, and tooltips.
  - **Deep Honey** (`#D97706`, `#F59E0B`): Signature brand tone, primary buttons, trend lines, and hero metrics.
  - **Burnt Amber** (`#B45309`, `#9A3412`): Secondary accents, transaction volume graphs, and alert contours.
- **Approachable Warmth & Heritage**: A deep roasted smoky espresso canvas (`#090604`, `#110B07`, `#1A110B`) paired with translucent smoked-amber glassmorphism (`backdrop-filter: blur(20px)`), fine gilded borders (`rgba(245, 158, 11, 0.14)`), and warm ambient lighting.
- **Accessibility & Contrast**: Built to exceed WCAG AA standards with warm cream/oatmeal typography (`#FFFBEB`, `#FDE68A`) and visible golden focus rings.
- **Reduced Motion Support**: Implements `@media (prefers-reduced-motion: reduce)` to disable transitions and animations for users who prefer reduced movement.
- **Keyboard Shortcuts**: Press `1` for Overview, `2` for Products, `3` for Insights, `4` for Assistant.

---

## 📐 Transparent Mathematical Formulas

| Metric | Formula | Example from Dataset |
| :--- | :--- | :--- |
| **Total Revenue** | $\sum (\text{Units Sold}_i \times \text{Price}_i)$ | $₹2,79,090$ |
| **Total Orders** | $\sum \text{Orders}_d$ | $174\text{ orders}$ |
| **Average Order Value (AOV)** | $\frac{\text{Total Revenue}}{\text{Total Orders}}$ | $\frac{₹2,79,090}{174} = ₹1,603.97$ |
| **Product Gross Profit** | $(\text{Price} - \text{Cost}) \times \text{Units Sold}$ | $(₹450 - ₹180) \times 113 = ₹30,510$ |
| **Product Margin %** | $\frac{\text{Price} - \text{Cost}}{\text{Price}} \times 100$ | $\frac{₹450 - ₹180}{₹450} \times 100 = 60.0\%$ |
| **Revenue Share %** | $\frac{\text{Product Revenue}}{\text{Total Revenue}} \times 100$ | $\frac{₹50,850}{₹2,79,090} \times 100 = 18.2\%$ |
| **Top 3 Concentration** | $\frac{\sum_{i=1}^3 \text{Revenue}_i}{\text{Total Revenue}} \times 100$ | $\frac{₹1,46,400}{₹2,79,090} \times 100 = 52.5\%$ |

---

## 📂 Project Directory Structure

```text
MerchantMate/
├── dist/                      # Production build output
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── CategoryChart.jsx  # Category revenue share progress distribution
│   │   ├── MetricCard.jsx     # Overview summary statistic card
│   │   ├── Navbar.jsx         # Top navigation, date range filter, notifications
│   │   ├── SalesTrendChart.jsx# 7-day Recharts area visualization
│   │   └── Sidebar.jsx        # Glassmorphic collapsible sidebar & mobile drawer
│   ├── data/
│   │   └── salesData.js       # 8 sample products, 7-day sales records, store config
│   ├── pages/                 # Four application views
│   │   ├── AssistantPage.jsx  # "Ask MerchantMate" interactive query engine UI
│   │   ├── InsightsPage.jsx   # 3 actionable recommendations with math proofs
│   │   ├── OverviewPage.jsx   # Executive overview dashboard
│   │   └── ProductsPage.jsx   # Product inventory table/grid with filters and sorting
│   ├── utils/
│   │   ├── calculations.js    # Pure, deterministic analytics formulas
│   │   └── queryEngine.js     # Modular natural language query intent handler
│   ├── App.jsx                # Application root with reactive state & shortcuts
│   ├── index.css              # Liquid-glass design system & responsive styling
│   └── main.jsx               # React entry point
├── .gitignore                 # Standard Git exclusion file
├── index.html                 # HTML template with Inter typography
├── package.json               # Scripts and dependencies
├── vercel.json                # Vercel deployment configuration
└── vite.config.js             # Vite configuration with chunk splitting
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation Steps

1. **Clone or navigate to the directory**:
   ```bash
   cd MerchantMate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Create a production build**:
   ```bash
   npm run build
   ```
   The compiled assets will be placed in the `/dist` folder.

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 🐙 Git & GitHub Integration Steps

If you want to push this repository to GitHub from your command line:

1. **Initialize Git repository**:
   ```bash
   git init
   git branch -M main
   ```

2. **Stage and commit files**:
   ```bash
   git add .
   git commit -m "feat: initial release of MerchantMate AI Business Assistant"
   ```

3. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name the repository: `MerchantMate`
   - Set visibility to **Public**
   - Do **not** initialize with README or .gitignore (these already exist)

4. **Link and push**:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/MerchantMate.git
   git push -u origin main
   ```

---

## ☁️ Vercel Deployment Instructions

MerchantMate is pre-configured for one-click deployment to **Vercel** via the included `vercel.json`.

### Option A: Deploy via GitHub (Recommended)
1. Push your code to GitHub following the steps above.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New...** → **Project**.
4. Import your `MerchantMate` repository.
5. In Project Settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**. Your site will be live within 60 seconds with an SSL certificate and automatic continuous deployment on every git push!

### Option B: Deploy via Vercel CLI
If you have Node.js and the Vercel CLI installed:
```bash
npm install -g vercel
vercel login
vercel
```
Follow the interactive prompts, accept the defaults (Vite preset, `dist` output), and your live URL will be generated immediately.

---

## 🔮 Roadmap & Next Steps

- [x] Responsive Liquid-Glass UI & Design System
- [x] Overview Dashboard with Recharts 7-Day Trend
- [x] Product Catalog with Search, Category Filter, and Sorting
- [x] 3 Transparent, Data-Backed Sales Insights with Math Proofs
- [x] Interactive "Ask MerchantMate" Query Interface
- [ ] Connect Google Gemini Flash API using `processMerchantQuery` async hook
- [ ] CSV / Excel Upload support for custom merchant data import
- [ ] Print / PDF Executive Report Export
