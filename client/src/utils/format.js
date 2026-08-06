export const formatINR = (amount) =>
  "₹" + Number(amount || 0).toLocaleString("en-IN");

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const CATEGORY_META = {
  Dairy: { emoji: "🥛", color: "#dbeafe" },
  Bakery: { emoji: "🍞", color: "#fef3c7" },
  Fruits: { emoji: "🍎", color: "#fce7f3" },
  Vegetables: { emoji: "🥦", color: "#dcfce7" },
  Snacks: { emoji: "🍿", color: "#ffe4e6" },
  Beverages: { emoji: "🧃", color: "#e0f2fe" },
  "Personal Care": { emoji: "🧴", color: "#f3e8ff" },
  "Household": { emoji: "🧹", color: "#e2e8f0" },
  "Meat & Fish": { emoji: "🍗", color: "#fee2e2" },
  "Baby Care": { emoji: "🍼", color: "#fef9c3" },
};

export const categoryMeta = (cat) =>
  CATEGORY_META[cat] || { emoji: "🛒", color: "#eef2f1" };

export const truncate = (str, n = 60) =>
  str?.length > n ? str.slice(0, n) + "…" : str;