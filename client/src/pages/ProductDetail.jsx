import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bot, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Store, Tag } from "lucide-react";
import { addReview, clearProduct, getProductById, getReviews } from "../store/slices/productSlice.js";
import { addToCart, updateCartItem } from "../store/slices/cartSlice.js";
import { getShopCoupons } from "../store/slices/shopSlice.js";
import StarRating from "../components/StarRating.jsx";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { categoryMeta, formatINR, timeAgo } from "../utils/format.js";
import { toastError, toastSuccess } from "../utils/toast.js";

export default function ProductDetail() {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, reviews, isProductLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { coupons } = useSelector((state) => state.shops);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(getProductById(pid));
    dispatch(getReviews(pid));
    return () => dispatch(clearProduct());
  }, [dispatch, pid]);

  useEffect(() => {
    if (product?.shop?._id) {
      dispatch(getShopCoupons(product.shop._id));
    }
  }, [dispatch, product?.shop?._id]);

  const inCart = (cart?.products || []).find(
    (item) => item.product?._id === pid || item.product === pid
  );
  const qty = inCart?.qty || 0;

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  }, [reviews]);

  if (isProductLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 grid md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-3xl" />
        <div className="space-y-3 pt-4">
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-6 w-28 rounded" />
          <div className="skeleton h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon="📦"
        title="Product not found"
        subtitle="This product may have been removed."
        action={
          <Link to="/products" className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl">
            Browse products
          </Link>
        }
      />
    );
  }

  const meta = categoryMeta(product.category);

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId: pid, qty: 1 }));
    toastSuccess("Added to cart!");
  };

  const handleQty = (delta) => {
    const next = qty + delta;
    if (next < 1) return;
    if (next > product.stock) {
      toastError(`Only ${product.stock} units available`);
      return;
    }
    dispatch(updateCartItem({ productId: pid, qty: next }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !text.trim()) {
      toastError("Please select a rating and write a review");
      return;
    }
    setAdding(true);
    const res = await dispatch(addReview({ pid, rating, text }));
    setAdding(false);
    if (res.meta.requestStatus === "fulfilled") {
      setRating(0);
      setText("");
      setReviewOpen(false);
      toastSuccess("Thanks for your review!");
    } else {
      toastError(res.payload || "Failed to submit review");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-5 transition"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative">
          <div className="bg-white rounded-3xl border border-line p-4">
            <img
              src={product.productImage}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-2xl"
            />
          </div>
          <span
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: meta.color }}
          >
            {meta.emoji} {product.category}
          </span>
          {product.stock === 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
            <Store size={15} /> {product.shop?.name || "Indore Bazar"}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 font-bold text-xs px-2.5 py-1 rounded-full">
              {avgRating ? avgRating.toFixed(1) : "New"} <StarRating rating={avgRating || 5} size={12} />
            </span>
            <span className="text-xs text-muted">
              {reviews.length > 0
                ? `${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                : "No reviews yet"}
            </span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs font-bold text-accent">⚡ Only {product.stock} left</span>
            )}
          </div>

          <div className="mt-5 flex items-end gap-2">
            <p className="text-3xl md:text-4xl font-extrabold">{formatINR(product.price)}</p>
            <p className="text-sm text-muted mb-1.5">per unit</p>
          </div>

          <p className="text-muted text-sm mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md text-xs">
            <div className="bg-surface rounded-xl p-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span className="text-muted">Fresh quality assured</span>
            </div>
            <div className="bg-surface rounded-xl p-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary shrink-0" />
              <span className="text-muted truncate">{product.shop?.address || "Indore, MP"}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {product.stock === 0 ? (
              <span className="bg-gray-100 text-gray-400 font-bold px-8 py-4 rounded-2xl text-lg">
                Out of stock
              </span>
            ) : qty === 0 ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-primary text-white font-extrabold text-lg px-10 py-4 rounded-2xl hover:bg-primary-dark active:scale-95 transition shadow-lg shadow-primary/30"
              >
                <ShoppingCart size={20} /> ADD
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-primary text-white rounded-2xl px-2 py-2 shadow-lg shadow-primary/30 animate-pop">
                <button onClick={() => handleQty(-1)} className="h-11 w-11 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center">
                  <Minus size={18} strokeWidth={3} />
                </button>
                <span className="w-10 text-center text-xl font-extrabold">{qty}</span>
                <button
                  onClick={() => handleQty(1)}
                  disabled={qty >= product.stock}
                  className="h-11 w-11 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center disabled:opacity-40"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            )}
            <Link
              to="/chat"
              className="flex items-center gap-2 bg-primary-light text-primary-dark font-bold px-5 py-4 rounded-2xl hover:bg-primary hover:text-white transition"
            >
              <Bot size={18} /> Ask AI
            </Link>
          </div>

          {/* Coupons */}
          {coupons.length > 0 && (
            <div className="mt-6 bg-accent-light rounded-2xl p-4 border border-accent/20">
              <p className="font-bold text-sm flex items-center gap-1.5 text-accent">
                <Tag size={15} /> Available offers
              </p>
              <div className="mt-2 space-y-1.5">
                {coupons.slice(0, 3).map((c) => (
                  <p key={c._id} className="text-xs text-ink font-medium">
                    🎁 Use code <b className="bg-white px-2 py-0.5 rounded-md border border-dashed border-accent/50">{c.couponCode}</b> to get {c.couponDiscount}% off on this shop
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">Customer reviews</h2>
          {isAuthenticated && (
            <button
              onClick={() => setReviewOpen((s) => !s)}
              className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-dark transition"
            >
              {reviewOpen ? "Cancel" : "Write a review"}
            </button>
          )}
        </div>

        {reviewOpen && (
          <form onSubmit={submitReview} className="bg-white rounded-2xl border border-line p-5 mb-6 animate-fade-up">
            <p className="text-sm font-bold mb-2">Your rating</p>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  className={`p-1.5 text-3xl transition ${i <= rating ? "text-amber-400 scale-110" : "text-gray-300 hover:text-amber-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell others about this product..."
              rows={3}
              className="w-full bg-surface rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <button
              type="submit"
              disabled={adding}
              className="mt-3 bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary-dark disabled:opacity-50"
            >
              {adding ? "Submitting..." : "Submit review"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-muted text-sm bg-white border border-line rounded-2xl p-6 text-center">
            Be the first to review this product! 💬
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl border border-line p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center">
                      {r.user?.name?.[0] || "U"}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{r.user?.name || "User"}</p>
                      <div className="flex items-center gap-2">
                        <StarRating rating={r.rating} size={12} />
                        <span className="text-[10px] text-muted">{timeAgo(r.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {r.isVerifiedBuyer && (
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Verified buyer
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted mt-3 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}