import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, MapPin, ShieldCheck, Truck, Zap } from "lucide-react";
import { createOrder } from "../store/slices/orderSlice.js";
import { getCart, removeCoupon } from "../store/slices/cartSlice.js";
import { formatINR } from "../utils/format.js";
import { toastError, toastSuccess } from "../utils/toast.js";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, coupon, discount, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { isCreating } = useSelector((state) => state.orders);

  const [method, setMethod] = useState("cod");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const items = cart?.products || [];
  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.product.price * it.qty, 0),
    [items]
  );
  const discountAmount = coupon ? (subtotal * coupon.couponDiscount) / 100 : discount || 0;
  const deliveryFee = subtotal - discountAmount >= 499 || subtotal === 0 ? 0 : 29;
  const total = subtotal - discountAmount + deliveryFee;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-16 flex justify-center">
        <span className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-extrabold">Nothing to checkout</h1>
        <p className="text-muted text-sm mt-2">Add items to your cart first.</p>
        <Link to="/products" className="inline-block mt-5 bg-primary text-white font-bold px-6 py-3 rounded-2xl">
          Browse products
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    const res = await dispatch(createOrder({ couponCode: coupon?.couponCode || "", paymentMethod: method }));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(removeCoupon());
      setPlaced(true);
      toastSuccess("Order placed successfully! 🎉");
      navigate(`/order-success/${res.payload._id}`);
    } else {
      toastError(res.payload || "Failed to place order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-5 transition"
      >
        <ArrowLeft size={16} /> Back to cart
      </button>

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-5">
          {/* Address */}
          <div className="bg-white rounded-3xl border border-line p-6">
            <h2 className="font-extrabold flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-primary" /> Delivery address
            </h2>
            <div className="bg-surface rounded-2xl p-4 flex items-start gap-3">
              <span className="h-10 w-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                <Home size={18} />
              </span>
              <div>
                <p className="font-bold text-sm">{user?.name} · {user?.phone}</p>
                <p className="text-sm text-muted mt-1">{user?.address || "No address on file"}</p>
              </div>
            </div>
            <p className="text-[11px] text-muted mt-2 flex items-center gap-1">
              <Truck size={13} className="text-primary" /> Expected delivery in 20-35 minutes
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-3xl border border-line p-6">
            <h2 className="font-extrabold flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-primary" /> Payment method
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setMethod("cod")}
                className={`w-full flex items-center gap-3 border-2 rounded-2xl p-4 text-left transition ${
                  method === "cod" ? "border-primary bg-primary-light/50" : "border-line hover:border-primary/40"
                }`}
              >
                <input type="radio" checked={method === "cod"} readOnly className="accent-primary" />
                <div>
                  <p className="font-bold text-sm">Cash on Delivery</p>
                  <p className="text-xs text-muted">Pay when your order arrives</p>
                </div>
              </button>
              <button
                onClick={() => setMethod("upi")}
                className={`w-full flex items-center gap-3 border-2 rounded-2xl p-4 text-left transition ${
                  method === "upi" ? "border-primary bg-primary-light/50" : "border-line hover:border-primary/40"
                }`}
              >
                <input type="radio" checked={method === "upi"} readOnly className="accent-primary" />
                <div>
                  <p className="font-bold text-sm">UPI / Card</p>
                  <p className="text-xs text-muted">Pay online securely (coming soon)</p>
                </div>
              </button>
            </div>
            {method === "upi" && (
              <p className="mt-3 text-xs text-accent bg-accent-light rounded-xl px-4 py-3">
                ⚡ Online payment is recorded as UPI/Card on your order — our delivery
                partner will collect it at your door.
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-3xl border border-line p-6 sticky top-32">
          <h2 className="font-extrabold text-lg mb-4">Order summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto hide-scroll pr-1 mb-4">
            {items.map((item) => (
              <div key={item.product?._id} className="flex items-center gap-3">
                <img
                  src={item.product.productImage}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{item.product.name}</p>
                  <p className="text-[10px] text-muted">Qty: {item.qty}</p>
                </div>
                <p className="text-xs font-extrabold">{formatINR(item.product.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-line pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Item total</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- {formatINR(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              {deliveryFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : <span className="font-semibold">{formatINR(deliveryFee)}</span>}
            </div>
            <div className="flex justify-between text-lg font-extrabold pt-2">
              <span>Total</span>
              <span className="text-primary">{formatINR(total)}</span>
            </div>
          </div>
          <button
            onClick={placeOrder}
            disabled={isCreating}
            className="mt-5 w-full bg-primary text-white font-extrabold py-4 rounded-2xl hover:bg-primary-dark active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-60"
          >
            {isCreating ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing order...
              </>
            ) : (
              <>
                <Zap size={18} /> Place order · {formatINR(total)}
              </>
            )}
          </button>
          <p className="text-[11px] text-muted text-center mt-3">
            By placing this order you agree to our terms & conditions
          </p>
        </div>
      </div>
    </div>
  );
}