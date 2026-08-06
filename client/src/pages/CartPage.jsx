import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Minus, Plus, ShieldCheck, Tag, Ticket, Trash2, X } from "lucide-react";
import { clearCart, getCart, removeFromCart, updateCartItem } from "../store/slices/cartSlice.js";
import { applyCoupon, getShopCoupons } from "../store/slices/shopSlice.js";
import { applyCouponLocal, removeCoupon, setDiscount } from "../store/slices/cartSlice.js";
import EmptyState from "../components/EmptyState.jsx";
import Spinner from "../components/Spinner.jsx";
import { formatINR } from "../utils/format.js";
import { toastError, toastSuccess } from "../utils/toast.js";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isLoading, coupon, discount } = useSelector((state) => state.cart);
  const { coupons, appliedCoupon, couponError } = useSelector((state) => state.shops);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (isAuthenticated) dispatch(getCart());
  }, [dispatch, isAuthenticated]);

  const items = cart?.products || [];
  const shopId = items[0]?.product?.shop?._id;

  useEffect(() => {
    if (shopId && !coupons.length) dispatch(getShopCoupons(shopId));
  }, [dispatch, shopId, coupons.length]);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.product.price * it.qty, 0),
    [items]
  );
  const discountAmount = useMemo(
    () => (coupon ? (subtotal * coupon.couponDiscount) / 100 : discount || 0),
    [coupon, discount, subtotal]
  );
  const deliveryFee = subtotal - discountAmount >= 499 || subtotal === 0 ? 0 : 29;
  const total = subtotal - discountAmount + deliveryFee;

  const applyCouponCode = async () => {
    if (!code.trim()) {
      toastError("Enter a coupon code first");
      return;
    }
    if (!shopId) return;
    const res = await dispatch(applyCoupon({ couponCode: code.trim().toUpperCase(), shopId }));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(applyCouponLocal(res.payload));
      dispatch(setDiscount((subtotal * res.payload.couponDiscount) / 100));
      toastSuccess(`Coupon ${res.payload.couponCode} applied! 🎉`);
      setCode("");
    } else {
      toastError(res.payload || "Invalid coupon");
    }
  };

  const handleRemove = (productId) => dispatch(removeFromCart(productId));
  const handleClear = async () => {
    await dispatch(clearCart());
    dispatch(removeCoupon());
    toastSuccess("Cart cleared");
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        subtitle="Add some fresh products and they'll show up here."
        action={
          <Link
            to="/products"
            className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark"
          >
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          My cart <span className="text-primary">({items.length})</span>
        </h1>
        <button
          onClick={handleClear}
          className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5"
        >
          <Trash2 size={15} /> Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const p = item.product;
            if (!p) return null;
            return (
              <div key={item.product?._id || item.product} className="bg-white rounded-2xl border border-line p-4 flex items-center gap-4 animate-fade-up">
                <Link to={`/product/${p._id}`} className="shrink-0">
                  <img src={p.productImage} alt={p.name} className="h-20 w-20 rounded-xl object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-primary uppercase truncate">{p.shop?.name}</p>
                  <Link to={`/product/${p._id}`} className="font-bold text-sm hover:text-primary transition block truncate">
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted mt-0.5 truncate">{p.category}</p>
                  <p className="text-primary font-extrabold mt-1">{formatINR(p.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => handleRemove(p._id)}
                    className="p-2 -m-2 text-muted hover:text-red-500 transition"
                    aria-label="Remove"
                  >
                    <X size={18} />
                  </button>
                  <div className="flex items-center gap-1 bg-surface rounded-xl p-1">
                    <button
                      onClick={() => dispatch(updateCartItem({ productId: p._id, qty: item.qty - 1 }))}
                      disabled={item.qty <= 1}
                      className="h-10 w-9 rounded-lg bg-white shadow-sm hover:bg-primary hover:text-white transition flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus size={15} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold">{item.qty}</span>
                    <button
                      onClick={() => {
                        if (item.qty >= p.stock) {
                          toastError(`Only ${p.stock} units available`);
                          return;
                        }
                        dispatch(updateCartItem({ productId: p._id, qty: item.qty + 1 }));
                      }}
                      disabled={item.qty >= p.stock}
                      className="h-10 w-9 rounded-lg bg-white shadow-sm hover:bg-primary hover:text-white transition flex items-center justify-center disabled:opacity-40"
                    >
                      <Plus size={15} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bill */}
        <div className="bg-white rounded-3xl border border-line p-6 sticky top-32">
          <h2 className="font-extrabold text-lg mb-4">Bill details</h2>

          {/* Coupon */}
          <div className="mb-4">
            {coupon ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center justify-between animate-pop">
                <div className="flex items-center gap-2">
                  <Ticket size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm font-extrabold text-green-700">{coupon.couponCode}</p>
                    <p className="text-[10px] text-green-600">{coupon.couponDiscount}% off applied</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    dispatch(removeCoupon());
                  }}
                  className="text-green-700 hover:text-green-900"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Apply coupon code"
                  className="flex-1 bg-surface rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                />
                <button
                  onClick={applyCouponCode}
                  className="px-4 py-3 bg-ink text-white rounded-xl text-sm font-bold hover:bg-primary transition"
                >
                  Apply
                </button>
              </div>
            )}
            {coupons.length > 0 && !coupon && (
              <div className="mt-2 flex flex-wrap gap-2">
                {coupons.slice(0, 3).map((c) => (
                  <button
                    key={c._id}
                    onClick={() => {
                      setCode(c.couponCode);
                    }}
                    className="text-[11px] font-bold bg-accent-light text-accent px-2.5 py-1 rounded-full border border-accent/30 hover:bg-accent hover:text-white transition"
                  >
                    {c.couponCode}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Item total</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Coupon discount ({coupon?.couponDiscount}%)</span>
                <span>- {formatINR(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Delivery fee</span>
              {deliveryFee === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                <span className="font-semibold">{formatINR(deliveryFee)}</span>
              )}
            </div>
            {deliveryFee > 0 && (
              <p className="text-[11px] text-muted bg-surface rounded-lg px-3 py-2">
                🚚 Add {formatINR(499 - (subtotal - discountAmount))} more for free delivery
              </p>
            )}
            <div className="border-t border-dashed border-line pt-3 flex justify-between text-lg font-extrabold">
              <span>To pay</span>
              <span className="text-primary">{formatINR(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full bg-primary text-white font-extrabold py-4 rounded-2xl hover:bg-primary-dark active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
          >
            Checkout <ArrowRight size={18} />
          </button>

          <div className="mt-4 flex items-center gap-2 justify-center text-[11px] text-muted">
            <ShieldCheck size={14} className="text-primary" /> Safe & secure — pay on delivery
          </div>
        </div>
      </div>

      {/* AI suggestion strip */}
      <div className="mt-8 bg-gradient-to-r from-primary-light to-white rounded-3xl border border-primary/20 p-6 flex flex-col sm:flex-row items-center gap-4">
        <span className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
          <Bot size={22} />
        </span>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-extrabold">Let AI check your cart 🧠</p>
          <p className="text-sm text-muted">Missing essentials? Better alternatives? Ask our assistant before checkout.</p>
        </div>
        <Link
          to="/chat"
          className="shrink-0 bg-primary text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-primary-dark transition"
        >
          Ask AI
        </Link>
      </div>
    </div>
  );
}