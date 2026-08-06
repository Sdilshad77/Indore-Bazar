import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { getMyOrders } from "../store/slices/orderSlice.js";
import EmptyState from "../components/EmptyState.jsx";
import Spinner from "../components/Spinner.jsx";
import { formatINR } from "../utils/format.js";

const STATUS_STYLES = {
  placed: "bg-blue-100 text-blue-700",
  dispatched: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function MyOrders() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No orders yet"
        subtitle="Your orders will appear here once you place one."
        action={
          <Link to="/products" className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark">
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">My orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="bg-white rounded-2xl border border-line p-5 hover:shadow-lg hover:-translate-y-0.5 transition block"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                  <Package size={20} />
                </span>
                <div>
                  <p className="font-extrabold text-sm">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {order.products?.length} item{order.products?.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {order.status}
                </span>
                <p className="font-extrabold text-primary">{formatINR(order.totalBillAmount)}</p>
              </div>
            </div>
            <div className="flex -space-x-3 mt-4">
              {order.products?.slice(0, 5).map((item) => (
                <img
                  key={item.product?._id}
                  src={item.product?.productImage}
                  alt=""
                  className="h-10 w-10 rounded-xl object-cover border-2 border-white"
                />
              ))}
              {order.products?.length > 5 && (
                <span className="h-10 w-10 rounded-xl bg-surface border-2 border-white flex items-center justify-center text-[10px] font-bold">
                  +{order.products.length - 5}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}