// Real-time Cloud Sync for Orders, Categories, Products & Settings
// Powered by Upstash Serverless REST API with seamless localStorage fallback

const UPSTASH_URL = "https://innocent-mosquito-98340.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAYAkAQIgcDJiNjQxZTg2NTBmMzk0YTQ4Yjk0YWMzZDdjZWYzMzUyZQ";

/**
 * Execute Upstash Redis command over HTTP REST
 */
async function redisCommand(commandArray) {
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandArray),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result;
  } catch (err) {
    console.warn("Cloud sync network error:", err.message);
    return null;
  }
}

// -------------------------------------------------------------
// ORDERS SYNC
// -------------------------------------------------------------

/**
 * Fetch orders from Cloud and merge with localStorage
 */
export async function syncOrdersFromCloud() {
  try {
    const raw = await redisCommand(["GET", "bbg_orders_global"]);
    if (raw) {
      const cloudOrders = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(cloudOrders)) {
        // Get local orders
        let localOrders = [];
        try {
          localOrders = JSON.parse(localStorage.getItem("bbg_orders") || "[]");
        } catch {}

        // Merge orders by orderNumber without duplicates
        const map = new Map();
        [...localOrders, ...cloudOrders].forEach((ord) => {
          if (ord && ord.orderNumber) {
            map.set(ord.orderNumber, ord);
          }
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        localStorage.setItem("bbg_orders", JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn("Failed to sync orders from cloud", e);
  }
  return null;
}

/**
 * Push an order to Cloud storage so admin immediately sees it
 */
export async function pushOrderToCloud(newOrder) {
  if (!newOrder || !newOrder.orderNumber) return;

  // 1. Save in single order key
  await redisCommand([
    "SET",
    `bbg_order:${newOrder.orderNumber}`,
    JSON.stringify(newOrder),
  ]);

  // 2. Fetch current global list, append and save back
  try {
    const raw = await redisCommand(["GET", "bbg_orders_global"]);
    let list = [];
    if (raw) {
      list = typeof raw === "string" ? JSON.parse(raw) : raw;
    }
    if (!Array.isArray(list)) list = [];

    // Filter out if already exists
    list = list.filter((o) => o.orderNumber !== newOrder.orderNumber);
    list.unshift(newOrder);

    await redisCommand(["SET", "bbg_orders_global", JSON.stringify(list)]);
  } catch (err) {
    console.warn("Cloud push error:", err);
  }
}

/**
 * Update order status (with courier / tracking info) in Cloud
 */
export async function updateOrderInCloud(orderNumber, updateFields) {
  try {
    const raw = await redisCommand(["GET", "bbg_orders_global"]);
    if (!raw) return;
    let list = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(list)) return;

    list = list.map((ord) => {
      if (ord.orderNumber === orderNumber) {
        return { ...ord, ...updateFields };
      }
      return ord;
    });

    await redisCommand(["SET", "bbg_orders_global", JSON.stringify(list)]);
  } catch (e) {
    console.warn("Failed to update order in cloud", e);
  }
}

// -------------------------------------------------------------
// CATEGORIES SYNC
// -------------------------------------------------------------

export async function syncCategoriesFromCloud() {
  try {
    const raw = await redisCommand(["GET", "bbg_categories_global"]);
    if (raw) {
      const cats = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(cats) && cats.length > 0) {
        localStorage.setItem("bbg_custom_categories", JSON.stringify(cats));
        return cats;
      }
    }
  } catch (e) {}
  return null;
}

export async function pushCategoriesToCloud(categories) {
  if (!Array.isArray(categories)) return;
  await redisCommand(["SET", "bbg_categories_global", JSON.stringify(categories)]);
}

// -------------------------------------------------------------
// PRODUCTS SYNC
// -------------------------------------------------------------

export async function syncProductsFromCloud() {
  try {
    const raw = await redisCommand(["GET", "bbg_products_global"]);
    if (raw) {
      const prods = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(prods) && prods.length > 0) {
        localStorage.setItem("bbg_custom_products", JSON.stringify(prods));
        return prods;
      }
    }
  } catch (e) {}
  return null;
}

export async function pushProductsToCloud(products) {
  if (!Array.isArray(products)) return;
  await redisCommand(["SET", "bbg_products_global", JSON.stringify(products)]);
}
