/**
 * MerchantMate - Business Intelligence & Analytics Calculations
 * 
 * Clean, pure calculation functions designed to be:
 * 1. 100% transparent and deterministic
 * 2. Directly derived from underlying raw sales data
 * 3. Easily explainable in engineering and product interviews
 */

/**
 * Format currency with Indian Rupee sign (₹) and Indian numbering system (Lakhs/Thousands)
 * @param {number} amount 
 * @returns {string} e.g. "₹5,842" or "₹1,24,500"
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format integer numbers with commas
 * @param {number} num 
 * @returns {string} e.g. "1,240"
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage with sign and one decimal place
 * @param {number} percent 
 * @returns {string} e.g. "+14.2%" or "-3.5%"
 */
export function formatPercent(percent) {
  if (typeof percent !== 'number' || isNaN(percent)) return '0.0%';
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

/**
 * Compute aggregated performance metrics for each product across the given sales period.
 * 
 * @param {Array} products - List of product definitions
 * @param {Array} dailySales - Array of daily sales records
 * @returns {Array} List of enriched product objects with unitsSold, revenue, profit, rank, and status
 */
export function calculateProductMetrics(products, dailySales) {
  if (!products || !dailySales) return [];

  // 1. Accumulate units sold per product id across all days
  const unitsSoldMap = {};
  dailySales.forEach(day => {
    if (day.productSales) {
      Object.entries(day.productSales).forEach(([prodId, qty]) => {
        unitsSoldMap[prodId] = (unitsSoldMap[prodId] || 0) + qty;
      });
    }
  });

  // 2. Map products with calculated financial metrics
  const enriched = products.map(product => {
    const unitsSold = unitsSoldMap[product.id] || 0;
    const revenue = Number((unitsSold * product.price).toFixed(2));
    const totalCost = Number((unitsSold * product.cost).toFixed(2));
    const grossProfit = Number((revenue - totalCost).toFixed(2));
    const profitMargin = revenue > 0 ? Number(((grossProfit / revenue) * 100).toFixed(1)) : 0;

    return {
      ...product,
      unitsSold,
      revenue,
      grossProfit,
      profitMargin
    };
  });

  // Calculate total revenue across all products to determine share
  const totalRev = enriched.reduce((sum, p) => sum + p.revenue, 0);

  // 3. Sort by revenue descending to assign ranks and share
  const sortedByRevenue = [...enriched].sort((a, b) => b.revenue - a.revenue);

  // Assign ranks, revenue shares, and performance badges
  return sortedByRevenue.map((product, index) => {
    const revenueShare = totalRev > 0 ? Number(((product.revenue / totalRev) * 100).toFixed(1)) : 0;
    
    // Performance badge rule:
    // Rank 1-3: Top Performer
    // Rank 4-5: Strong Growth
    // Rank 6-7: Steady
    // Rank 8 or lowest units: Needs Attention
    let performanceStatus = 'Steady';
    let statusTone = 'neutral';

    if (index < 3) {
      performanceStatus = 'Top Performer';
      statusTone = 'success';
    } else if (index < 5) {
      performanceStatus = 'Strong Growth';
      statusTone = 'info';
    } else if (index >= sortedByRevenue.length - 2) {
      performanceStatus = 'Needs Attention';
      statusTone = 'warning';
    }

    return {
      ...product,
      rank: index + 1,
      revenueShare,
      performanceStatus,
      statusTone
    };
  });
}

/**
 * Calculate the overall sales trend per day (revenue, orders, units, AOV)
 * 
 * @param {Array} dailySales 
 * @param {Array} products 
 * @returns {Array} Daily trend records formatted for Recharts
 */
export function calculateDailyTrend(dailySales, products) {
  if (!dailySales || !products) return [];

  const priceMap = {};
  products.forEach(p => {
    priceMap[p.id] = p.price;
  });

  return dailySales.map(day => {
    let dayRevenue = 0;
    let dayUnits = 0;

    if (day.productSales) {
      Object.entries(day.productSales).forEach(([prodId, qty]) => {
        // Only count active products present in the current catalog
        if (priceMap[prodId] !== undefined) {
          dayUnits += qty;
          const price = priceMap[prodId] || 0;
          dayRevenue += price * qty;
        }
      });
    }

    dayRevenue = Number(dayRevenue.toFixed(2));
    const orders = day.orders || 0;
    const aov = orders > 0 ? Number((dayRevenue / orders).toFixed(2)) : 0;

    return {
      date: day.date,
      day: day.day,
      displayDate: day.displayDate,
      orders,
      revenue: dayRevenue,
      units: dayUnits,
      aov
    };
  });
}

/**
 * Calculate overall summary card metrics:
 * 1. Total Revenue
 * 2. Total Orders
 * 3. Average Order Value (Total Revenue / Total Orders)
 * 4. Best-Selling Product (highest revenue or units)
 * 
 * @param {Array} dailyTrend 
 * @param {Array} productMetrics 
 * @param {Object} previousPeriodStats 
 * @returns {Object} Comprehensive summary metrics
 */
export function calculateDashboardSummary(dailyTrend, productMetrics, previousPeriodStats = null) {
  const totalRevenue = dailyTrend.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = dailyTrend.reduce((sum, d) => sum + d.orders, 0);
  const totalUnits = dailyTrend.reduce((sum, d) => sum + d.units, 0);

  // Average Order Value = Total Revenue / Total Orders
  const averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

  // Best selling product by revenue
  const bestSellerByRevenue = productMetrics.length > 0 
    ? [...productMetrics].sort((a, b) => b.revenue - a.revenue)[0] 
    : null;

  // Best selling product by units sold
  const bestSellerByUnits = productMetrics.length > 0
    ? [...productMetrics].sort((a, b) => b.unitsSold - a.unitsSold)[0]
    : null;

  // Lowest performing product by units sold
  const lowestPerformer = productMetrics.length > 0
    ? [...productMetrics].sort((a, b) => a.unitsSold - b.unitsSold)[0]
    : null;

  // Top 3 products by revenue
  const topThreeProducts = productMetrics.slice(0, 3);
  const topThreeRevenue = topThreeProducts.reduce((sum, p) => sum + p.revenue, 0);
  const topThreeShare = totalRevenue > 0 ? Number(((topThreeRevenue / totalRevenue) * 100).toFixed(1)) : 0;

  // Growth percentages compared to previous period if available
  let revenueGrowth = null;
  let ordersGrowth = null;
  let aovGrowth = null;

  if (previousPeriodStats) {
    if (previousPeriodStats.totalRevenue > 0) {
      revenueGrowth = Number((((totalRevenue - previousPeriodStats.totalRevenue) / previousPeriodStats.totalRevenue) * 100).toFixed(1));
    }
    if (previousPeriodStats.totalOrders > 0) {
      ordersGrowth = Number((((totalOrders - previousPeriodStats.totalOrders) / previousPeriodStats.totalOrders) * 100).toFixed(1));
    }
    if (previousPeriodStats.averageOrderValue > 0) {
      aovGrowth = Number((((averageOrderValue - previousPeriodStats.averageOrderValue) / previousPeriodStats.averageOrderValue) * 100).toFixed(1));
    }
  }

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    totalUnits,
    averageOrderValue,
    bestSellerByRevenue,
    bestSellerByUnits,
    lowestPerformer,
    topThreeProducts,
    topThreeRevenue,
    topThreeShare,
    growth: {
      revenue: revenueGrowth,
      orders: ordersGrowth,
      aov: aovGrowth
    }
  };
}

/**
 * Identify the peak sales day in the given trend
 * @param {Array} dailyTrend 
 * @returns {Object} Day with highest revenue
 */
export function calculatePeakSalesDay(dailyTrend) {
  if (!dailyTrend || dailyTrend.length === 0) return null;
  return dailyTrend.reduce((max, day) => day.revenue > max.revenue ? day : max, dailyTrend[0]);
}

/**
 * Calculate category breakdown (revenue and units per category)
 * @param {Array} productMetrics 
 * @returns {Array} List of categories with revenue, units, and share
 */
export function calculateCategoryBreakdown(productMetrics) {
  if (!productMetrics) return [];

  const categoryMap = {};
  let totalRevenue = 0;

  productMetrics.forEach(p => {
    totalRevenue += p.revenue;
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = {
        category: p.category,
        revenue: 0,
        unitsSold: 0,
        productCount: 0
      };
    }
    categoryMap[p.category].revenue += p.revenue;
    categoryMap[p.category].unitsSold += p.unitsSold;
    categoryMap[p.category].productCount += 1;
  });

  return Object.values(categoryMap)
    .map(c => ({
      ...c,
      revenue: Number(c.revenue.toFixed(2)),
      share: totalRevenue > 0 ? Number(((c.revenue / totalRevenue) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
}
