import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Package, Receipt, Store } from "lucide-react";
import { createShop, getMyShop } from "../../store/slices/shopSlice.js";
import { getProducts } from "../../store/slices/productSlice.js";
import ShopNav from "../../components/shop/ShopNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import { formatINR } from "../../utils/format.js";
import { toastError, toastSuccess } from "../../utils/toast.js";
import API from "../../api/axios.js";

export default function ShopDashboard() {
  const dispatch = useDispatch();
  const { myShop } = useSelector((state) => state.shops);
  const { products } = useSelector((state) => state.products);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", address: "", shopPhone: "" });
  const [creating, setCreating] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    dispatch(getMyShop()).finally(() => setLoading(false));
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (myShop) {
      API.get("/api/shop-owner/order/")
        .then((res) => setOrders(res.data))
        .catch(() => {});
    }
  }, [myShop]);

  const myProducts = useMemo(
    () => products.filter((p) => p.shop?._id === myShop?._id),
    [products, myShop]
  );

  const stats = useMemo(
    () => ({
      revenue: orders.reduce(
        (a, o) => (o.status !== "cancelled" ? a + o.totalBillAmount : a),
        0
      ),
      pending: orders.filter((o) => o.status === "placed").length,
      total: orders.length,
    }),
    [orders]
  );

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    const res = await dispatch(createShop(form));
    setCreating(false);
    if (res.meta.requestStatus === "fulfilled") {
      toastSuccess("Shop request sent to admin for approval!");
      dispatch(getMyShop());
    } else {
      toastError(res.payload);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // No shop → create
  if (!myShop) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <div className="bg-white rounded-3xl border border-line p-8 md:p-10 max-w-xl mx-auto animate-fade-up">
          <span className="h-14 w-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
            <Store size={26} />
          </span>
          <h1 className="text-2xl font-extrabold mt-4">Open your shop on Indore Bazar 🏪</h1>
          <p className="text-sm text-muted mt-2">
            List your products, manage orders & grow your business. Your request goes to our
            admin for quick approval.
          </p>

          <form onSubmit={create} className="mt-6 space-y-4">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Shop name"
              className="w-full bg-surface rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition"
            />
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description about your shop"
              rows={3}
              className="w-full bg-surface rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition resize-none"
            />
            <input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Shop address"
              className="w-full bg-surface rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition"
            />
            <input
              required
              type="tel"
              maxLength={10}
              value={form.shopPhone}
              onChange={(e) => setForm({ ...form, shopPhone: e.target.value.replace(/\D/g, "") })}
              placeholder="Shop phone number"
              className="w-full bg-surface rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {creating ? <Spinner size="sm" light /> : <>Submit for approval <ArrowRight size={17} /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Pending shop
  if (myShop.status !== "accepted") {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <ShopNav shopName={myShop.name} />
        <div className="bg-white rounded-3xl border border-line p-10 text-center max-w-lg mx-auto">
          <span className="text-5xl">⏳</span>
          <h1 className="text-xl font-extrabold mt-4">{myShop.name}</h1>
          <p className="text-sm text-muted mt-2">
            Your shop is <b className="text-amber-600 uppercase">{myShop.status}</b> — an admin
            will review your request shortly. You'll be able to add products once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
      <ShopNav shopName={myShop.name} />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {myShop.name} 👋</h1>
          <p className="text-sm text-muted mt-1">Here's how your shop is doing today</p>
        </div>
        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
          ✓ Approved & live
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-line p-5 min-w-0">
          <p className="text-xs text-muted font-bold uppercase flex items-center gap-1.5">
            <Package size={14} className="text-primary" /> Products
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate">{myProducts.length}</p>
          <Link to="/seller/products" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">
            Manage →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-line p-5 min-w-0">
          <p className="text-xs text-muted font-bold uppercase flex items-center gap-1.5">
            <Receipt size={14} className="text-primary" /> Orders
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold mt-2 truncate">{stats.total}</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">{stats.pending} pending action</p>
        </div>
        <div className="bg-white rounded-2xl border border-line p-5 min-w-0">
          <p className="text-xs text-muted font-bold uppercase flex items-center gap-1.5">
            <Clock size={14} className="text-primary" /> Revenue
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold mt-2 text-primary truncate">{formatINR(stats.revenue)}</p>
          <p className="text-xs text-muted mt-1">From {stats.total} order{stats.total === 1 ? "" : "s"}</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-3xl border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold">Recent orders</h2>
          <Link to="/seller/orders" className="text-sm font-bold text-primary hover:underline">
            View all →
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">
            No orders yet — share your shop link to start selling! 🚀
          </p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o._id} className="flex items-center justify-between gap-3 bg-surface rounded-2xl p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-9 w-9 rounded-xl bg-white flex items-center justify-center font-bold text-primary">
                    {o.user?.name?.[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{o.user?.name}</p>
                    <p className="text-xs text-muted">#{o._id.slice(-6).toUpperCase()} · {o.products?.length} items</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-sm">{formatINR(o.totalBillAmount)}</p>
                  <span className={`text-[10px] font-bold uppercase ${o.status === "cancelled" ? "text-red-500" : o.status === "delivered" ? "text-green-600" : "text-amber-600"}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}