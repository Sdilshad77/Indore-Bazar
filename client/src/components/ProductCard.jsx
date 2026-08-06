import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { addToCart, updateCartItem } from "../store/slices/cartSlice.js";
import { truncate } from "../utils/format.js";
import { toastError } from "../utils/toast.js";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const inCart = (cart?.products || []).find(
    (item) => item.product?._id === product._id || item.product === product._id
  );
  const qty = inCart?.qty || 0;

  const handleAdd = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    dispatch(addToCart({ productId: product._id, qty: 1 }));
  };

  const handleChange = (delta) => {
    const next = qty + delta;
    if (next < 1) return;
    if (next > product.stock) {
      toastError("Only " + product.stock + " units available");
      return;
    }
    dispatch(updateCartItem({ productId: product._id, qty: next }));
  };

  return (
    <div className="group bg-white rounded-2xl border border-line hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col animate-fade-up">
      <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden bg-surface">
        <img
          src={product.productImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-ink/80 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of stock
            </span>
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            {product.shop?.name || "Indore Bazar"}
          </p>
          <h3 className="text-sm font-bold text-ink leading-snug mt-0.5 line-clamp-2 group-hover:text-primary transition">
            {product.name}
          </h3>
          <p className="text-xs text-muted mt-0.5 line-clamp-1">{truncate(product.description, 50)}</p>
        </Link>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-extrabold text-ink truncate">₹{product.price}</p>
            <p className="text-[11px] text-muted">per unit</p>
          </div>

          {qty === 0 ? (
            product.stock > 0 ? (
              <button
                onClick={handleAdd}
                disabled={!isAuthenticated}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark active:scale-95 transition shadow-sm shadow-primary/30 disabled:opacity-50"
              >
                ADD
              </button>
            ) : (
              <span className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-bold">
                ADD
              </span>
            )
          ) : (
            <div className="flex items-center gap-1 bg-primary text-white rounded-xl py-1 px-1 shadow-sm shadow-primary/30 animate-pop">
              <button
                onClick={() => handleChange(-1)}
                className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                <Minus size={15} strokeWidth={3} />
              </button>
              <span className="w-7 text-center text-sm font-extrabold">{qty}</span>
              <button
                onClick={() => handleChange(1)}
                disabled={qty >= product.stock}
                className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center disabled:opacity-40"
              >
                <Plus size={15} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}