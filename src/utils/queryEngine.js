/**
 * MerchantMate - Query Engine & Natural Language Assistant Logic
 * 
 * Modular engine that maps merchant queries to calculated business insights.
 * 
 * Architectural Note:
 * This module is decoupled from the UI. When migrating to an actual AI model
 * (such as Google Gemini API or OpenAI API), replace or wrap `processMerchantQuery`
 * with an async API call while preserving the response interface.
 */

import {
  formatCurrency,
  formatNumber,
  formatPercent,
  calculateDashboardSummary,
  calculateDailyTrend,
  calculateProductMetrics,
  calculatePeakSalesDay,
  calculateCategoryBreakdown
} from './calculations.js';

export const SUGGESTED_QUESTIONS = [
  "What is my total revenue?",
  "Which product generates the most revenue?",
  "Which product sells the least?",
  "Which products should I focus on?",
  "Summarize my sales performance.",
  "What is my average order value?",
  "What was my best sales day?"
];

/**
 * Process a user query against the current dataset and return a structured response.
 * 
 * @param {string} rawQuery - The natural language query from the merchant
 * @param {Object} dataset - The sales dataset { products, dailySales, previousPeriodStats }
 * @returns {Object} Structured response with title, keyMetric, explanation, dataPoints, and advice
 */
export function processMerchantQuery(rawQuery, { products, dailySales, previousPeriodStats }) {
  const query = (rawQuery || '').trim().toLowerCase();

  // Compute live metrics from dataset
  const productMetrics = calculateProductMetrics(products, dailySales);
  const dailyTrend = calculateDailyTrend(dailySales, products);
  const summary = calculateDashboardSummary(dailyTrend, productMetrics, previousPeriodStats);
  const peakDay = calculatePeakSalesDay(dailyTrend);
  const categories = calculateCategoryBreakdown(productMetrics);

  const bestSeller = summary.bestSellerByRevenue;
  const lowestPerformer = summary.lowestPerformer;
  const topThree = summary.topThreeProducts;

  // 1. Total Revenue query
  if (
    query.includes('total revenue') ||
    query.includes('how much did i make') ||
    query.includes('how much revenue') ||
    query.includes('gross sales') ||
    (query.includes('revenue') && !query.includes('which product') && !query.includes('most') && !query.includes('least'))
  ) {
    const growthText = summary.growth.revenue !== null
      ? `This represents a ${formatPercent(summary.growth.revenue)} increase compared to the previous 7-day period (${formatCurrency(previousPeriodStats.totalRevenue)}).`
      : '';

    return {
      query: rawQuery,
      intent: 'TOTAL_REVENUE',
      badge: 'Revenue Metric',
      title: '7-Day Total Revenue',
      keyMetric: formatCurrency(summary.totalRevenue),
      metricLabel: 'Gross Sales (Oct 23 - Oct 29)',
      summary: `Your store generated a total of ${formatCurrency(summary.totalRevenue)} across ${formatNumber(summary.totalOrders)} customer orders over the past 7 days.`,
      details: [
        `Total orders processed: ${formatNumber(summary.totalOrders)} orders`,
        `Average daily revenue: ${formatCurrency(summary.totalRevenue / dailyTrend.length)} / day`,
        growthText
      ].filter(Boolean),
      actionAdvice: 'Revenue momentum is positive. Ensure stock levels for high-velocity items remain adequate for the upcoming weekend peak.',
      isFallback: false
    };
  }

  // 2. Best-selling / Highest revenue product
  if (
    query.includes('most revenue') ||
    query.includes('highest revenue') ||
    query.includes('top product') ||
    query.includes('best seller') ||
    query.includes('best-selling') ||
    query.includes('generates the most') ||
    query.includes('top selling')
  ) {
    return {
      query: rawQuery,
      intent: 'TOP_PRODUCT',
      badge: 'Product Performance',
      title: 'Highest Revenue Generating Product',
      keyMetric: bestSeller ? bestSeller.name : 'N/A',
      metricLabel: bestSeller ? `${formatCurrency(bestSeller.revenue)} in sales (${bestSeller.unitsSold} units)` : '',
      summary: bestSeller
        ? `"${bestSeller.name}" is your top performer, generating ${formatCurrency(bestSeller.revenue)} (${bestSeller.revenueShare}% of all store revenue) with ${bestSeller.unitsSold} units sold.`
        : 'No product sales recorded.',
      details: [
        `Category: ${bestSeller?.category}`,
        `Retail Price: ${formatCurrency(bestSeller?.price)} (Unit margin: ${bestSeller?.profitMargin}%)`,
        `Units Sold: ${bestSeller?.unitsSold} units`,
        `Current Inventory: ${bestSeller?.inventory} units left in stock`
      ],
      actionAdvice: 'Because this item drives a substantial share of total earnings, maintain at least 2 weeks of safety buffer in your stockroom to prevent stockouts.',
      isFallback: false
    };
  }

  // 3. Lowest selling / Sells the least
  if (
    query.includes('sells the least') ||
    query.includes('least revenue') ||
    query.includes('worst') ||
    query.includes('lowest') ||
    query.includes('slowest') ||
    query.includes('underperforming')
  ) {
    return {
      query: rawQuery,
      intent: 'LOWEST_PRODUCT',
      badge: 'Inventory Alert',
      title: 'Lowest-Performing Product by Volume',
      keyMetric: lowestPerformer ? lowestPerformer.name : 'N/A',
      metricLabel: lowestPerformer ? `${lowestPerformer.unitsSold} units sold (${formatCurrency(lowestPerformer.revenue)})` : '',
      summary: lowestPerformer
        ? `"${lowestPerformer.name}" has the lowest sales volume this period, selling only ${lowestPerformer.unitsSold} units totaling ${formatCurrency(lowestPerformer.revenue)}.`
        : 'No data available.',
      details: [
        `Category: ${lowestPerformer?.category}`,
        `Retail Price: ${formatCurrency(lowestPerformer?.price)}`,
        `Share of store revenue: ${lowestPerformer?.revenueShare}%`,
        `Current stock on shelf: ${lowestPerformer?.inventory} units`
      ],
      actionAdvice: 'Consider bundling this item with high-volume anchors like the Dark Roast Coffee, or placing a promotional discount or sample display near checkout to accelerate turnover.',
      isFallback: false
    };
  }

  // 4. Which products should I focus on? / Recommendations
  if (
    query.includes('focus') ||
    query.includes('recommend') ||
    query.includes('prioritize') ||
    query.includes('action') ||
    query.includes('strategy') ||
    query.includes('what should i do')
  ) {
    const topNames = topThree.map(p => p.name).join(', ');
    return {
      query: rawQuery,
      intent: 'FOCUS_PRODUCTS',
      badge: 'Strategic Focus',
      title: 'Strategic Product Priorities',
      keyMetric: `Top 3: ${summary.topThreeShare}% of Revenue`,
      metricLabel: 'Revenue Concentration Ratio',
      summary: `Focus attention on your top 3 revenue generators (${topNames}), which collectively generate ${formatCurrency(summary.topThreeRevenue)}, representing ${summary.topThreeShare}% of your entire business.`,
      details: [
        `1. Protect hero inventory: Keep "${bestSeller?.name}" and "${topThree[1]?.name}" fully stocked.`,
        `2. Upsell bundling: Pair low-velocity items (e.g. "${lowestPerformer?.name}") with your bestselling coffee and mug items.`,
        `3. Capitalize on weekend surges: Saturday was your highest traffic day with ${formatNumber(peakDay?.orders)} orders.`
      ],
      actionAdvice: 'Protect your margins on your top 3 hero products while using promotional bundles to clear slower-moving lifestyle inventory.',
      isFallback: false
    };
  }

  // 5. Average Order Value (AOV)
  if (
    query.includes('average order') ||
    query.includes('aov') ||
    query.includes('basket size') ||
    query.includes('spend per order')
  ) {
    const aovGrowth = summary.growth.aov !== null ? formatPercent(summary.growth.aov) : null;
    return {
      query: rawQuery,
      intent: 'AVERAGE_ORDER_VALUE',
      badge: 'Order Metric',
      title: 'Average Order Value (AOV)',
      keyMetric: formatCurrency(summary.averageOrderValue),
      metricLabel: `Calculated: ${formatCurrency(summary.totalRevenue)} ÷ ${formatNumber(summary.totalOrders)} orders`,
      summary: `Your average customer order is ${formatCurrency(summary.averageOrderValue)}. On average, customers purchase approximately ${(summary.totalUnits / summary.totalOrders).toFixed(1)} items per transaction.`,
      details: [
        `Total transactions: ${formatNumber(summary.totalOrders)}`,
        `Total units purchased: ${formatNumber(summary.totalUnits)}`,
        aovGrowth ? `AOV change vs prior period: ${aovGrowth}` : null,
        `Highest daily AOV: ${formatCurrency(Math.max(...dailyTrend.map(d => d.aov)))}`
      ].filter(Boolean),
      actionAdvice: 'To raise AOV above ₹1,800, offer a threshold incentive such as "Complimentary Artisan Neem & Honey Soap with purchases over ₹2,500".',
      isFallback: false
    };
  }

  // 6. Total orders / transaction volume
  if (
    query.includes('order') ||
    query.includes('transactions') ||
    query.includes('how many sales') ||
    query.includes('customer count')
  ) {
    return {
      query: rawQuery,
      intent: 'TOTAL_ORDERS',
      badge: 'Volume Metric',
      title: 'Total Order Volume',
      keyMetric: `${formatNumber(summary.totalOrders)} Orders`,
      metricLabel: '7-Day Order Transactions',
      summary: `Your shop completed ${formatNumber(summary.totalOrders)} orders over the 7-day period, averaging ${(summary.totalOrders / dailyTrend.length).toFixed(1)} orders per day.`,
      details: [
        `Peak day volume: ${peakDay?.day} (${formatNumber(peakDay?.orders)} orders)`,
        `Slowest day volume: Mon (${formatNumber(Math.min(...dailyTrend.map(d => d.orders)))} orders)`,
        summary.growth.orders !== null ? `Order growth vs prior 7 days: ${formatPercent(summary.growth.orders)}` : null
      ].filter(Boolean),
      actionAdvice: 'Monday and Tuesday experience lower foot traffic. Consider running mid-week email or local loyalty perks to smooth out transaction volume.',
      isFallback: false
    };
  }

  // 7. Best sales day / Peak day
  if (
    query.includes('best sales day') ||
    query.includes('peak day') ||
    query.includes('busiest day') ||
    query.includes('highest day') ||
    query.includes('best day')
  ) {
    return {
      query: rawQuery,
      intent: 'PEAK_DAY',
      badge: 'Traffic Timing',
      title: 'Peak Sales Day Analysis',
      keyMetric: `${peakDay?.day} (${peakDay?.displayDate})`,
      metricLabel: `${formatCurrency(peakDay?.revenue)} from ${peakDay?.orders} orders`,
      summary: `${peakDay?.day} was your most lucrative sales day, contributing ${formatCurrency(peakDay?.revenue)} (${Number(((peakDay?.revenue / summary.totalRevenue) * 100).toFixed(1))}% of weekly revenue).`,
      details: [
        `Transactions: ${peakDay?.orders} orders`,
        `Items sold: ${peakDay?.units} units`,
        `Day AOV: ${formatCurrency(peakDay?.aov)}`,
        `Weekend revenue (Sat + Sun): ${formatCurrency(
          dailyTrend.filter(d => d.day === 'Sat' || d.day === 'Sun').reduce((acc, cur) => acc + cur.revenue, 0)
        )}`
      ],
      actionAdvice: 'Ensure staffing is optimized for Saturday 11am-4pm and merchandise displays are fully replenished on Friday evenings.',
      isFallback: false
    };
  }

  // 8. Categories
  if (
    query.includes('category') ||
    query.includes('categories') ||
    query.includes('departments')
  ) {
    const topCat = categories[0];
    return {
      query: rawQuery,
      intent: 'CATEGORIES',
      badge: 'Category Breakdown',
      title: 'Sales by Product Category',
      keyMetric: topCat ? `${topCat.category} (${topCat.share}%)` : 'N/A',
      metricLabel: topCat ? `${formatCurrency(topCat.revenue)} generated` : '',
      summary: `Your catalog spans ${categories.length} active retail categories. "${topCat?.category}" is your leading category by gross revenue, followed by "${categories[1]?.category}".`,
      details: categories.map(c => `${c.category}: ${formatCurrency(c.revenue)} (${c.share}% share, ${c.unitsSold} units)`),
      actionAdvice: 'Beverages and Home Goods make up over half of your earnings. Cross-merchandise these two categories together on prominent endcaps.',
      isFallback: false
    };
  }

  // 9. Overall Summary / Performance Overview
  if (
    query.includes('summarize') ||
    query.includes('summary') ||
    query.includes('performance') ||
    query.includes('overview') ||
    query.includes('how am i doing') ||
    query.includes('business health')
  ) {
    return {
      query: rawQuery,
      intent: 'SUMMARY',
      badge: 'Store Summary',
      title: 'Weekly Business Performance Summary',
      keyMetric: `${formatCurrency(summary.totalRevenue)} Gross Revenue`,
      metricLabel: `${formatNumber(summary.totalOrders)} Orders • ${formatCurrency(summary.averageOrderValue)} AOV`,
      summary: `Artisan & Co. is performing strongly with ${formatCurrency(summary.totalRevenue)} in revenue across ${summary.totalOrders} transactions. Your top revenue anchor is "${bestSeller?.name}", while weekend trading accounts for the majority of sales volume.`,
      details: [
        `Top Product: ${bestSeller?.name} (${formatCurrency(bestSeller?.revenue)})`,
        `Average Basket Size: ${formatCurrency(summary.averageOrderValue)}`,
        `Busiest Day: ${peakDay?.day} (${formatCurrency(peakDay?.revenue)})`,
        `Lowest Product: ${lowestPerformer?.name} (${lowestPerformer?.unitsSold} units sold)`
      ],
      actionAdvice: 'Maintain healthy stock on your top 3 sellers and consider cross-promotions on lower-velocity personal care and accessory goods.',
      isFallback: false
    };
  }

  // Fallback for custom or unrecognized queries
  return {
    query: rawQuery,
    intent: 'FALLBACK',
    badge: 'Query Assistance',
    title: 'Assistant Understanding & Quick Insights',
    keyMetric: `${formatCurrency(summary.totalRevenue)} Store Total`,
    metricLabel: 'Based on your 7-day dataset',
    summary: `I've analyzed your store's 7-day performance for "${rawQuery}". Here is a concise snapshot of your primary business metrics, or click any suggested question below:`,
    details: [
      `Total 7-day revenue: ${formatCurrency(summary.totalRevenue)} (${formatNumber(summary.totalOrders)} orders)`,
      `Average Order Value: ${formatCurrency(summary.averageOrderValue)}`,
      `Top Seller: ${bestSeller?.name} (${formatCurrency(bestSeller?.revenue)})`,
      `Lowest Unit Mover: ${lowestPerformer?.name} (${lowestPerformer?.unitsSold} units)`
    ],
    actionAdvice: 'Try asking: "Which product generates the most revenue?", "What is my average order value?", or "Which products should I focus on?".',
    isFallback: true
  };
}
