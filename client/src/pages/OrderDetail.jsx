import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Package, Phone } from "lucide-react";
import { cancelOrder, getOrderById } from "../store/slices/orderSlice.js";
import Spinner from "../components/Spinner.jsx";
import { formatINR } from "../utils/format.js";
import { toastError, toastSuccess } from "../utils/toast.js";

const TRACK = ["placed", "dispatched", "delivered"];

export default function OrderDetail() {
  const { oid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((state) => state.orders);
  const { error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderById(oid));
  }, [dispatch, oid]);

  if (!order && error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="text-2xl font-extrabold">Order not found</h1>
        <p className="text-muted text-sm mt-2">{error}</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-5 bg-primary text-white font-bold px-5 py-2.5 rounded-xl"
        >
          Back to my orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const stepIndex = TRACK.indexOf(order.status);
  const canCancel = order.status === "placed";

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const res = await dispatch(cancelOrder(oid));
      if (res.meta.requestStatus === "fulfilled") {
        toastSuccess("Order cancelled");
      } else {
        toastError(res.payload || "Failed to cancel order");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-5 transition"
      >
        <ArrowLeft size={16} /> My orders
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-sm text-muted">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`text-sm font-bold uppercase px-4 py-2 rounded-full ${
            order.status === "placed"
              ? "bg-blue-100 text-blue-700"
              : order.status === "dispatched"
              ? "bg-amber-100 text-amber-700"
              : order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Tracking */}
      {order.status !== "cancelled" && (
        <div className="bg-white rounded-3xl border border-line p-6 mb-6">
          <h2 className="font-extrabold mb-5 flex items-center gap-2">
            <Package size={18} className="text-primary" /> Delivery tracking
          </h2>
          <div className="flex items-center">
            {TRACK.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative z-10">
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      i <= stepIndex
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase mt-1.5 ${i <= stepIndex ? "text-primary" : "text-gray-400"}`}>
                    {s}
                  </span>
                </div>
                {i < TRACK.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-5 ${i < stepIndex ? "bg-primary" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-3xl border border-line p-6 mb-6">
        <h2 className="font-extrabold mb-4">Items</h2>
        <div className="space-y-3">
          {order.products?.map((item) => (
            <div key={item.product?._id} className="flex items-center gap-3">
              <img src={item.product?.productImage} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{item.product?.name}</p>
                <p className="text-xs text-muted">Qty: {item.qty} × {formatINR(item.purchasedPrice)}</p>
              </div>
              <p className="font-extrabold text-sm">{formatINR(item.purchasedPrice * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-line mt-5 pt-4 flex justify-between text-lg font-extrabold">
          <span>Total {order.isDiscounted && <span className="text-green-600 text-xs font-bold">(coupon applied 🎁)</span>}</span>
          <span className="text-primary">{formatINR(order.totalBillAmount)}</span>
        </div>
      </div>

      {/* Shop + delivery */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-3xl border border-line p-6">
          <h2 className="font-extrabold mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-primary" /> Shop
          </h2>
          <p className="font-bold">{order.shop?.name || "Indore Bazar"}</p>
          <p className="text-sm text-muted mt-1">{order.shop?.address}</p>
        </div>
        <div className="bg-white rounded-3xl border border-line p-6">
          <h2 className="font-extrabold mb-3 flex items-center gap-2">
            <Phone size={18} className="text-primary" /> Delivering to
          </h2>
          <p className="font-bold">{order.user?.name}</p>
          <p className="text-sm text-muted mt-1">{order.user?.phone}</p>
          <p className="text-sm text-muted">{order.user?.address}</p>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-3xl border border-line p-6 mb-6 flex items-center justify-between">
        <p className="font-extrabold">Payment method</p>
        <span className="text-sm font-bold uppercase bg-surface px-3 py-1.5 rounded-full">
          {order.paymentMethod === "upi"
            ? "UPI / Card"
            : order.paymentMethod === "card"
            ? "Card"
            : "Cash on Delivery"}
        </span>
      </div>

      {canCancel && (
        <button
          onClick={handleCancel}
          className="w-full sm:w-auto bg-red-50 text-red-600 font-bold px-6 py-3 rounded-2xl hover:bg-red-100 transition"
        >
          Cancel order
        </button>
      )}
    </div>
  );
}