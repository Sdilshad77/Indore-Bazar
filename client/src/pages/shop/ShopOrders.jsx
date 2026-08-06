import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { getMyShop } from "../../store/slices/shopSlice.js";
import ShopNav from "../../components/shop/ShopNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import API from "../../api/axios.js";
import { formatINR } from "../../utils/format.js";
import { toastError, toastSuccess } from "../../utils/toast.js";

const STATUS_BADGES = {
  placed: "bg-blue-100 text-blue-700",
  dispatched: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function ShopOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myShop } = useSelector((state) => state.shops);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(getMyShop()).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!myShop) return;
    loadOrders();
  }, [myShop?._id]);

  const loadOrders = async () => {
    try {
      const { data } = await API.get("/api/shop-owner/order/");
      setOrders(data);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (myShop && myShop.status !== "accepted" && !loading) {
      navigate("/seller/dashboard");
    }
  }, [myShop, loading, navigate]);

  const updateStatus = async (oid, status) => {
    if (!window.confirm(`Mark this order as ${status}?`)) return;
    setUpdating(oid);
    try {
      await API.put(`/api/shop-owner/order/${oid}`, { status });
      toastSuccess(`Order marked as ${status}`);
      await loadOrders();
    } catch (err) {
      toastError(err?.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
      <ShopNav shopName={myShop?.name} />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Shop orders</h1>
        <p className="text-sm text-muted mt-1">
          Update order status — stock is adjusted automatically when you dispatch 🚚
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line p-12 text-center">
          <p className="text-5xl">🧾</p>
          <p className="font-extrabold mt-4 text-lg">No orders yet</p>
          <p className="text-sm text-muted mt-1">When customers order from your shop, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl border border-line p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-extrabold text-sm">#{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(o.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${STATUS_BADGES[o.status] || ""}`}>
                  {o.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 bg-surface rounded-xl p-3">
                <span className="h-8 w-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {o.user?.name?.[0]}
                </span>
                <p className="flex-1 min-w-0 text-sm font-bold truncate">{o.user?.name}</p>
                <p className="text-xs text-muted flex items-center gap-1 shrink-0">
                  <Phone size={12} /> {o.user?.phone}
                </p>
              </div>

              <button
                onClick={() => setSelected(selected === o._id ? null : o._id)}
                className="text-xs font-bold text-primary hover:underline mt-3"
              >
                {selected === o._id ? "Hide items ▲" : "View items ▼"}
              </button>

              {selected === o._id && (
                <div className="mt-3 space-y-2 bg-surface rounded-xl p-3 animate-fade-up">
                  {o.products?.map((item) => (
                    <div key={item.product?._id} className="flex items-center gap-3 text-sm">
                      <img src={item.product?.productImage} alt="" className="h-9 w-9 rounded-lg object-cover" />
                      <span className="flex-1 font-semibold truncate">{item.product?.name}</span>
                      <span className="text-muted">×{item.qty}</span>
                      <span className="font-bold">{formatINR(item.purchasedPrice * item.qty)}</span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-line pt-2 flex justify-between font-extrabold">
                    <span>{o.isDiscounted && <span className="text-green-600 text-xs">(coupon applied 🎁) </span>}Total</span>
                    <span className="text-primary">{formatINR(o.totalBillAmount)}</span>
                  </div>
                </div>
              )}

              {o.status === "placed" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(o._id, "dispatched")}
                    disabled={updating === o._id}
                    className="flex-1 bg-primary text-white font-bold text-sm py-2.5 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition"
                  >
                    Dispatch 🚚
                  </button>
                  <button
                    onClick={() => updateStatus(o._id, "cancelled")}
                    disabled={updating === o._id}
                    className="flex-1 bg-red-50 text-red-600 font-bold text-sm py-2.5 rounded-xl hover:bg-red-100 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {o.status === "dispatched" && (
                <button
                  onClick={() => updateStatus(o._id, "delivered")}
                  disabled={updating === o._id}
                  className="mt-4 w-full bg-green-600 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 transition"
                >
                  Mark delivered ✓
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}