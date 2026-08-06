import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, TicketPercent } from "lucide-react";
import { getMyShop } from "../../store/slices/shopSlice.js";
import ShopNav from "../../components/shop/ShopNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import API from "../../api/axios.js";
import { toastError, toastSuccess } from "../../utils/toast.js";

export default function ShopCoupons() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myShop } = useSelector((state) => state.shops);

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ couponCode: "", couponDiscount: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getMyShop()).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!myShop) return;
    API.get(`/api/coupons/${myShop._id}`)
      .then((res) => setCoupons(res.data))
      .catch(() => setCoupons([]));
  }, [myShop?._id]);

  if (myShop && myShop.status !== "accepted" && !loading) {
    navigate("/seller/dashboard");
    return null;
  }

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.post("/api/shop-owner/coupon", {
        couponCode: form.couponCode.toUpperCase(),
        couponDiscount: form.couponDiscount,
      });
      setCoupons([...coupons, data]);
      setForm({ couponCode: "", couponDiscount: "" });
      setModal(false);
      toastSuccess("Coupon created! 🎁");
    } catch (err) {
      toastError(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setSaving(false);
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

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Coupons & offers</h1>
          <p className="text-sm text-muted mt-1">
            Create discount codes — customers apply them at checkout 🎁
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-2xl hover:bg-primary-dark transition shadow-lg shadow-primary/30"
        >
          <Plus size={18} /> Create coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line p-12 text-center">
          <p className="text-5xl">🎟️</p>
          <p className="font-extrabold mt-4 text-lg">No coupons yet</p>
          <p className="text-sm text-muted mt-1">
            Offer discounts to attract more customers to your shop.
          </p>
          <button
            onClick={() => setModal(true)}
            className="mt-5 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition"
          >
            + Create your first coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-line overflow-hidden">
              <div className="bg-gradient-to-r from-accent to-orange-500 text-white px-5 py-6 relative">
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white" />
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white" />
                <p className="text-2xl font-extrabold tracking-wider">{c.couponCode}</p>
                <p className="text-xs text-white/85 mt-1">{c.couponDiscount}% OFF on your order</p>
              </div>
              <div className="p-4 flex items-center justify-between bg-white rounded-b-2xl">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
                  <TicketPercent size={14} className="text-primary" /> Active · shown at checkout
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={create}
            className="bg-white rounded-3xl w-full max-w-sm p-6 animate-pop"
          >
            <h2 className="font-extrabold text-lg mb-4">Create coupon 🎁</h2>
            <div className="space-y-4">
              <input
                required
                value={form.couponCode}
                onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE10"
                className="w-full bg-surface rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div>
                <input
                  required
                  type="number"
                  min={1}
                  max={90}
                  value={form.couponDiscount}
                  onChange={(e) => setForm({ ...form, couponDiscount: e.target.value })}
                  placeholder="Discount % (1-90)"
                  className="w-full bg-surface rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white font-extrabold py-3.5 rounded-2xl hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <Spinner size="sm" light /> : "Create coupon"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}