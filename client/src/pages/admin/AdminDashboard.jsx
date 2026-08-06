import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Package, Store, TrendingUp, Users } from "lucide-react";
import { adminGetOrders, adminGetShops, adminGetUsers } from "../../store/slices/adminSlice.js";
import AdminNav from "../../components/admin/AdminNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import { formatINR } from "../../utils/format.js";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { users, orders, shops, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetUsers());
    dispatch(adminGetOrders());
    dispatch(adminGetShops());
  }, [dispatch]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((a, o) => a + o.totalBillAmount, 0);
    const pendingShops = shops.filter((s) => s.status === "pending").length;
    const pendingOrders = orders.filter((o) => o.status === "placed").length;
    return { revenue, pendingShops, pendingOrders };
  }, [orders, shops]);

  if (isLoading && !users.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards = [
    { label: "Total users", value: users.length, icon: <Users size={20} />, color: "bg-blue-100 text-blue-600", link: "/admin/users" },
    { label: "Total orders", value: orders.length, icon: <Package size={20} />, color: "bg-green-100 text-green-600", link: "/admin/orders" },
    { label: "Shops", value: shops.length, icon: <Store size={20} />, color: "bg-amber-100 text-amber-600", link: "/admin/shops" },
    { label: "Revenue", value: formatINR(stats.revenue), icon: <TrendingUp size={20} />, color: "bg-purple-100 text-purple-600", link: "/admin/orders" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
      <AdminNav />

      <h1 className="text-2xl font-extrabold tracking-tight mb-6">Platform overview 👨‍💼</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.link} className="bg-white rounded-2xl border border-line p-5 hover:shadow-lg transition">
            <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${c.color}`}>
              {c.icon}
            </span>
            <p className="text-2xl font-extrabold mt-3">{c.value}</p>
            <p className="text-xs text-muted font-semibold">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Action alerts */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/shops"
          className="bg-white rounded-2xl border border-line p-5 flex items-center justify-between hover:border-amber-400 transition"
        >
          <div>
            <p className="font-extrabold">🏪 Shop approvals</p>
            <p className="text-sm text-muted mt-1">
              {stats.pendingShops > 0
                ? `${stats.pendingShops} shop(s) waiting for approval`
                : "No pending approvals 🎉"}
            </p>
          </div>
          {stats.pendingShops > 0 && (
            <span className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 font-extrabold flex items-center justify-center animate-pulse">
              {stats.pendingShops}
            </span>
          )}
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white rounded-2xl border border-line p-5 flex items-center justify-between hover:border-primary transition"
        >
          <div>
            <p className="font-extrabold">📦 Order status</p>
            <p className="text-sm text-muted mt-1">
              {stats.pendingOrders > 0
                ? `${stats.pendingOrders} order(s) in "placed" state`
                : "All orders moving along 👍"}
            </p>
          </div>
          {stats.pendingOrders > 0 && (
            <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center">
              {stats.pendingOrders}
            </span>
          )}
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-3xl border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-bold text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 5).map((o) => (
            <div key={o._id} className="flex items-center justify-between gap-3 bg-surface rounded-2xl p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">
                  #{o._id.slice(-6).toUpperCase()} · {o.user?.name}
                </p>
                <p className="text-xs text-muted">{o.products?.length} items · {o.shop?.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-sm">{formatINR(o.totalBillAmount)}</p>
                <span className={`text-[10px] font-bold uppercase ${o.status === "cancelled" ? "text-red-500" : o.status === "delivered" ? "text-green-600" : "text-amber-600"}`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-muted text-center py-6">No orders on the platform yet</p>
          )}
        </div>
      </div>
    </div>
  );
}