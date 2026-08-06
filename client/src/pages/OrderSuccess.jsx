import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { getOrderById } from "../store/slices/orderSlice.js";
import { resetCart } from "../store/slices/cartSlice.js";
import { formatINR } from "../utils/format.js";
import Spinner from "../components/Spinner.jsx";

export default function OrderSuccess() {
  const { oid } = useParams();
  const dispatch = useDispatch();
  const { order, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderById(oid));
    dispatch(resetCart());
  }, [dispatch, oid]);

  if (isLoading && !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order && error) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h1 className="text-2xl font-extrabold">Could not load your order</h1>
        <p className="text-muted text-sm mt-2 max-w-md mx-auto">
          {error}. You can still check your orders from the My Orders page.
        </p>
        <Link
          to="/orders"
          className="mt-6 inline-block bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition"
        >
          My orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
      <div className="bg-white rounded-3xl border border-line p-8 md:p-10 text-center animate-fade-up">
        <span className="inline-flex h-20 w-20 rounded-full bg-green-100 items-center justify-center">
          <CheckCircle2 size={44} className="text-green-600" />
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-5">Order placed successfully! 🎉</h1>
        <p className="text-muted text-sm mt-2 max-w-md mx-auto">
          Your order <b className="text-ink">#{order?._id?.slice(-6).toUpperCase()}</b> is confirmed.
          We'll deliver it to your doorstep in 20-35 minutes.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-primary-light text-primary-dark text-sm font-bold px-5 py-2.5 rounded-full">
          <Package size={16} /> Status: <span className="uppercase">{order?.status}</span>
        </div>

        <div className="mt-8 bg-surface rounded-2xl p-5 text-left">
          <h2 className="font-extrabold mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" /> Order items
          </h2>
          <div className="space-y-3">
            {order?.products?.map((item) => (
              <div key={item.product?._id} className="flex items-center gap-3">
                <img src={item.product?.productImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.product?.name}</p>
                  <p className="text-xs text-muted">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-extrabold">{formatINR(item.purchasedPrice * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-line mt-4 pt-4 flex justify-between text-lg font-extrabold">
            <span>Total paid</span>
            <span className="text-primary">{formatINR(order?.totalBillAmount)}</span>
          </div>
          {order?.isDiscounted && (
            <p className="text-xs text-green-600 font-semibold mt-2">🎁 Coupon discount applied!</p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/orders"
            className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition"
          >
            Track my order
          </Link>
          <Link
            to="/products"
            className="bg-surface text-ink font-bold px-6 py-3 rounded-2xl hover:bg-primary-light transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}