import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { adminGetOrders, adminUpdateOrder } from "../../store/slices/adminSlice.js";
import AdminNav from "../../components/admin/AdminNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import { formatINR } from "../../utils/format.js";
import { toastError, toastSuccess } from "../../utils/toast.js";

const STATUSES = ["placed", "dispatched", "delivered", "cancelled"];
const BADGES = {
  placed: "bg-blue-100 text-blue-700",
  dispatched: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    dispatch(adminGetOrders());
  }, [dispatch]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const changeStatus = async (oid, status) => {
    setBusy(oid);
    const res = await dispatch(adminUpdateOrder({ oid, status }));
    setBusy(null);
    if (res.meta.requestStatus === "fulfilled") {
      toastSuccess(`Order marked as ${status}`);
    } else {
      toastError(res.payload || "Failed to update order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
      <AdminNav />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">All orders</h1>
          <p className="text-sm text-muted mt-1">{orders.length} orders on platform</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-bold px-3.5 py-2 rounded-full border capitalize transition ${
                filter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-line text-muted hover:border-primary/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line p-12 text-center text-muted">
          No orders in this state
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl border border-line p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-primary-light text-primary font-extrabold flex items-center justify-center">
                    {o.user?.name?.[0]}
                  </span>
                  <div>
                    <p className="font-extrabold text-sm">
                      #{o._id.slice(-6).toUpperCase()} · {o.user?.name}
                    </p>
                    <p className="text-xs text-muted">
                      {o.shop?.name} · {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-extrabold">{formatINR(o.totalBillAmount)}</p>
                  <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${BADGES[o.status]}`}>
                    {o.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
                <button
                  onClick={() => setOpen(open === o._id ? null : o._id)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {open === o._id ? "Hide items ▲" : "View items ▼"} ({o.products?.length})
                </button>
                <div className="relative">
                  <select
                    value={o.status}
                    disabled={busy === o._id}
                    onChange={(e) => changeStatus(o._id, e.target.value)}
                    className="appearance-none bg-surface rounded-xl pl-4 pr-9 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </div>

              {open === o._id && (
                <div className="mt-4 space-y-2 bg-surface rounded-xl p-4 animate-fade-up">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}