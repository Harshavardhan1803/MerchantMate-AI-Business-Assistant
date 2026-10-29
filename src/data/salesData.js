/**
 * MerchantMate - Sample Indian Retail Small Business Dataset
 * Represents an artisanal Indian lifestyle & specialty boutique ("Artisan & Co. Goods")
 * Contains 8 distinct products across 5 retail categories,
 * along with detailed 7-day sales records and previous period benchmarks.
 * All pricing, revenue, and transactional values are formatted in Indian Rupees (₹).
 */

export const STORE_INFO = {
  name: "Artisan & Co. Goods",
  tagline: "Specialty Goods & Handcrafted Essentials",
  currency: "₹",
  periodLabel: "Last 7 Days (Oct 23 - Oct 29, 2026)",
  owner: "Priya Sharma",
  plan: "Pro Merchant"
};

export const SAMPLE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Artisan Dark Roast Coffee (250g)",
    sku: "BEV-COF-01",
    category: "Beverages",
    price: 450,
    cost: 180,
    inventory: 48,
    rating: 4.9,
    description: "Single-origin shade-grown Chikmagalur Arabica beans roasted in small batches with notes of dark chocolate and jaggery."
  },
  {
    id: "prod-2",
    name: "Handcrafted Ceramic Mug",
    sku: "HOM-MUG-02",
    category: "Home Goods",
    price: 650,
    cost: 240,
    inventory: 32,
    rating: 4.8,
    description: "Khurja wheel-thrown speckled stoneware mug with an ergonomic handle and satin matte glaze."
  },
  {
    id: "prod-3",
    name: "Organic Kashmiri Kahwa Green Tea",
    sku: "BEV-TEA-03",
    category: "Beverages",
    price: 380,
    cost: 140,
    inventory: 65,
    rating: 4.7,
    description: "Traditional Himalayan green tea infused with saffron strands, crushed cardamom, cinnamon, and whole almonds."
  },
  {
    id: "prod-4",
    name: "Eco-Friendly Jute & Canvas Tote",
    sku: "ACC-TOT-04",
    category: "Accessories",
    price: 550,
    cost: 190,
    inventory: 54,
    rating: 4.6,
    description: "Heavyweight biodegradable jute and cotton canvas tote with reinforced stitching and vegan leather straps."
  },
  {
    id: "prod-5",
    name: "Soy Wax Sandalwood Candle",
    sku: "HOM-CND-05",
    category: "Home Goods",
    price: 750,
    cost: 260,
    inventory: 41,
    rating: 4.9,
    description: "Hand-poured 50-hour clean burning candle infused with natural Mysore sandalwood and wild amber essential oils."
  },
  {
    id: "prod-6",
    name: "Refillable Leather Journal",
    sku: "STN-JRN-06",
    category: "Stationery",
    price: 890,
    cost: 320,
    inventory: 23,
    rating: 4.9,
    description: "Handcrafted full-grain saddle leather binder with 192 archival handmade cotton deckle pages and antique brass clasp."
  },
  {
    id: "prod-7",
    name: "Cold-Pressed Neem & Honey Soap",
    sku: "PER-SOP-07",
    category: "Personal Care",
    price: 220,
    cost: 65,
    inventory: 85,
    rating: 4.5,
    description: "Gentle cold-process artisan bar crafted with organic neem extract, raw forest honey, and virgin coconut oil."
  },
  {
    id: "prod-8",
    name: "Insulated Stainless Steel Flask (500ml)",
    sku: "ACC-TMB-08",
    category: "Accessories",
    price: 950,
    cost: 380,
    inventory: 29,
    rating: 4.8,
    description: "Double-wall vacuum insulated travel chai flask that keeps beverages piping hot for 10 hours."
  }
];

/**
 * Daily sales records for the last 7 days.
 * Includes sales quantities per product ID and total transaction order counts.
 */
export const DAILY_SALES = [
  {
    date: "2026-10-23",
    day: "Fri",
    displayDate: "Oct 23",
    orders: 22,
    productSales: {
      "prod-1": 14,
      "prod-2": 9,
      "prod-3": 6,
      "prod-4": 7,
      "prod-5": 8,
      "prod-6": 5,
      "prod-7": 6,
      "prod-8": 4
    }
  },
  {
    date: "2026-10-24",
    day: "Sat",
    displayDate: "Oct 24",
    orders: 35,
    productSales: {
      "prod-1": 22,
      "prod-2": 15,
      "prod-3": 11,
      "prod-4": 12,
      "prod-5": 14,
      "prod-6": 9,
      "prod-7": 8,
      "prod-8": 8
    }
  },
  {
    date: "2026-10-25",
    day: "Sun",
    displayDate: "Oct 25",
    orders: 31,
    productSales: {
      "prod-1": 19,
      "prod-2": 13,
      "prod-3": 9,
      "prod-4": 10,
      "prod-5": 12,
      "prod-6": 7,
      "prod-7": 9,
      "prod-8": 7
    }
  },
  {
    date: "2026-10-26",
    day: "Mon",
    displayDate: "Oct 26",
    orders: 16,
    productSales: {
      "prod-1": 11,
      "prod-2": 6,
      "prod-3": 5,
      "prod-4": 4,
      "prod-5": 5,
      "prod-6": 3,
      "prod-7": 4,
      "prod-8": 3
    }
  },
  {
    date: "2026-10-27",
    day: "Tue",
    displayDate: "Oct 27",
    orders: 19,
    productSales: {
      "prod-1": 13,
      "prod-2": 7,
      "prod-3": 7,
      "prod-4": 5,
      "prod-5": 6,
      "prod-6": 4,
      "prod-7": 5,
      "prod-8": 4
    }
  },
  {
    date: "2026-10-28",
    day: "Wed",
    displayDate: "Oct 28",
    orders: 24,
    productSales: {
      "prod-1": 16,
      "prod-2": 10,
      "prod-3": 8,
      "prod-4": 8,
      "prod-5": 9,
      "prod-6": 6,
      "prod-7": 6,
      "prod-8": 5
    }
  },
  {
    date: "2026-10-29",
    day: "Thu",
    displayDate: "Oct 29",
    orders: 27,
    productSales: {
      "prod-1": 18,
      "prod-2": 12,
      "prod-3": 9,
      "prod-4": 9,
      "prod-5": 11,
      "prod-6": 7,
      "prod-7": 7,
      "prod-8": 6
    }
  }
];

/**
 * Previous 7 days comparison baseline for transparent growth metrics (in INR)
 */
export const PREVIOUS_PERIOD_STATS = {
  totalRevenue: 258000.00,
  totalOrders: 164,
  averageOrderValue: 1573.17
};

export const CATEGORIES = [
  "All Categories",
  "Beverages",
  "Home Goods",
  "Accessories",
  "Stationery",
  "Personal Care"
];
