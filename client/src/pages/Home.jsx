import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  Bot,
  CheckCircle2,
  Clock,
  Copy,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { getFeaturedReviews, getProducts } from "../store/slices/productSlice.js";
import { getShopCoupons, getShops } from "../store/slices/shopSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import StarRating from "../components/StarRating.jsx";
import { ProductSkeleton } from "../components/Skeletons.jsx";
import { categoryMeta } from "../utils/format.js";
import { toastSuccess } from "../utils/toast.js";

const FEATURES = [
  { icon: <Clock size={20} />, title: "Delivery in 20–35 min", desc: "Superfast dispatch from local shops" },
  { icon: <Package size={20} />, title: "100% fresh", desc: "Hand-picked quality every single day" },
  { icon: <ShieldCheck size={20} />, title: "Secure payments", desc: "Pay easily & safely on delivery" },
  { icon: <Truck size={20} />, title: "Free delivery", desc: "On orders above ₹499" },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, featuredReviews, isLoading } = useSelector((state) => state.products);
  const { shops, coupons } = useSelector((state) => state.shops);

  useEffect(() => {
    if (products.length === 0) dispatch(getProducts());
    if (shops.length === 0) dispatch(getShops());
    if (featuredReviews.length === 0) dispatch(getFeaturedReviews());
  }, [dispatch, products.length, shops.length, featuredReviews.length]);

  useEffect(() => {
    if (shops.length > 0) {
      shops.forEach((shop) => dispatch(getShopCoupons(shop._id)));
    }
  }, [dispatch, shops]);

  const categories = useMemo(() => {
    const seen = new Set();
    return products.filter((p) => {
      if (seen.has(p.category)) return false;
      seen.add(p.category);
      return true;
    });
  }, [products]);

  const trending = useMemo(
    () =>
      [...products]
        .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
        .slice(0, 8),
    [products]
  );

  const lowStockDeals = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 10).slice(0, 8),
    [products]
  );

  const heroProducts = useMemo(
    () => products.filter((p) => p.stock > 0).slice(0, 3),
    [products]
  );

  const heroMain = heroProducts[0] || null;
  const heroSide = heroProducts.slice(1, 3);

  const deals = useMemo(() => coupons.filter((c) => c.isActive).slice(0, 4), [coupons]);

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    toastSuccess(`Coupon ${code} copied! Apply it at checkout 🎉`);
  };

  const shopOf = (sid) => shops.find((s) => s._id === sid);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6">
      {/* ================= HERO ================= */}
      <section className="relative mt-4 md:mt-6 rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-emerald-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_15%_20%,white,transparent_40%),radial-gradient(circle_at_85%_0%,white,transparent_35%),radial-gradient(circle_at_50%_100%,white,transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgM0wzIDMwdjNMMjAgM2wxNyAzMHYtM0wyMCAzeiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]" />

        <div className="relative px-6 md:px-12 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Sparkles size={13} className="text-amber-300" />
              INDORE'S SMARTEST GROCERY STORE
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Groceries at
              <br />
              <span className="text-amber-300">lightning speed</span>
            </h1>
            <p className="mt-3 text-white/85 text-sm md:text-base max-w-md">
              Fresh dairy, veggies, snacks & more — from trusted local shops of Indore,
              delivered to your door in minutes. Let AI pick the perfect basket for you!
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-primary-dark font-extrabold px-6 py-3.5 rounded-2xl hover:bg-amber-300 hover:text-ink transition shadow-lg"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/30 font-bold px-6 py-3.5 rounded-2xl hover:bg-white/25 transition"
              >
                <Bot size={18} /> Ask AI Assistant
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/85">
              <span className="flex items-center gap-1.5 font-semibold">
                <Package size={14} className="text-amber-300" /> {products.length}+ products live
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Star size={14} className="text-amber-300 fill-amber-300" /> 4.8★ rated shops
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock size={14} className="text-amber-300" /> 10,000+ deliveries
              </span>
            </div>
          </div>

          {/* Product collage */}
          {heroMain && (
            <div className="relative">
              <div className="hidden md:grid grid-cols-2 gap-4 justify-items-end">
                <div className="relative col-span-2 justify-self-end">
                  <div className="absolute -inset-3 bg-white/10 rounded-[2.5rem] rotate-3" />
                  <img
                    src={heroMain.productImage}
                    alt={heroMain.name}
                    className="relative h-56 w-56 lg:h-64 lg:w-64 object-cover rounded-[2rem] shadow-2xl border-4 border-white/20"
                  />
                  <div className="absolute -bottom-4 -left-2 bg-white text-ink rounded-2xl shadow-xl px-4 py-3 animate-pop">
                    <p className="text-[10px] text-muted font-semibold uppercase">Today's pick</p>
                    <p className="font-bold text-sm">{heroMain.name}</p>
                    <p className="text-primary font-extrabold">₹{heroMain.price}</p>
                  </div>
                </div>
                {heroSide.map((p) => (
                  <div key={p._id} className="relative justify-self-end">
                    <img
                      src={p.productImage}
                      alt={p.name}
                      className="h-24 w-24 lg:h-28 lg:w-28 object-cover rounded-2xl shadow-xl border-2 border-white/25"
                    />
                    <span className="absolute -bottom-2 left-2 bg-accent text-white text-[10px] font-extrabold px-2 py-1 rounded-full shadow">
                      ₹{p.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile compact strip */}
              <div className="md:hidden grid grid-cols-3 gap-2">
                {heroProducts.map((p) => (
                  <img
                    key={p._id}
                    src={p.productImage}
                    alt={p.name}
                    className="h-20 w-full object-cover rounded-2xl border-2 border-white/20 shadow-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl border border-line p-4 flex items-center gap-3 hover:shadow-md transition"
          >
            <span className="h-10 w-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              {f.icon}
            </span>
            <div>
              <p className="text-sm font-bold">{f.title}</p>
              <p className="text-xs text-muted">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ================= CATEGORIES (photo tiles) ================= */}
      {categories.length > 0 && (
        <section className="mt-10">
          <SectionHeader
            title="Shop by category"
            subtitle="Everything you need, all in one place"
            link="View all"
            onLink={() => navigate("/products")}
          />
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const meta = categoryMeta(cat.category);
                const items = products.filter((p) => p.category === cat.category);
                return (
                  <Link
                    key={cat.category}
                    to={`/products?category=${encodeURIComponent(cat.category)}`}
                    className="relative group overflow-hidden rounded-2xl aspect-[3/4] border border-line"
                  >
                    <img
                      src={cat.productImage}
                      alt={cat.category}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <p className="text-lg font-extrabold drop-shadow">
                        {meta.emoji} {cat.category}
                      </p>
                      <p className="text-[11px] text-white/80 font-semibold">
                        {items.length} items · Shop now
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ================= DEALS (real coupons) ================= */}
      <section className="mt-10">
        <SectionHeader
          title="🎁 Today's deals"
          subtitle="Flat % off — grab a coupon, apply at checkout"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {deals.map((c) => {
            const shop = shopOf(c.shop);
            return (
              <div
                key={c._id}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-orange-500 text-white p-4 flex flex-col justify-between min-h-36 hover:shadow-xl hover:-translate-y-0.5 transition group"
              >
                <span className="absolute -top-5 -right-5 h-20 w-20 rounded-full bg-white/10" />
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-100">
                    <BadgePercent size={13} /> Limited time
                  </p>
                  <p className="text-2xl font-extrabold mt-1">
                    FLAT {c.couponDiscount}% OFF
                  </p>
                  <p className="text-[11px] text-white/85 mt-0.5 truncate">
                    {shop?.name || "Indore Bazar"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <button
                    onClick={() => copyCode(c.couponCode)}
                    className="inline-flex items-center gap-1.5 bg-white/95 text-accent font-extrabold text-xs px-3 py-2 rounded-xl hover:bg-amber-50 transition"
                  >
                    <Copy size={12} /> {c.couponCode}
                  </button>
                  <Link
                    to="/products"
                    className="text-[11px] font-bold underline underline-offset-2 hover:text-amber-100 transition"
                  >
                    Shop now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <section className="mt-10">
        <SectionHeader
          title="🔥 Trending now"
          subtitle="What Indore is buying right now"
          link="View all"
          onLink={() => navigate("/products")}
        />
        {isLoading ? (
          <ProductSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ================= REVIEWS ================= */}
      {featuredReviews.length > 0 && (
        <section className="mt-12">
          <SectionHeader
            title="❤️ Loved by Indore"
            subtitle="Real reviews from verified buyers"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredReviews.slice(0, 3).map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl border border-line p-5 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <StarRating rating={r.rating} size={15} />
                  {r.isVerifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle2 size={11} /> Verified buyer
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink mt-3 leading-relaxed line-clamp-3">"{r.text}"</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-line">
                  <span className="h-9 w-9 rounded-full bg-primary-light text-primary text-sm font-extrabold flex items-center justify-center">
                    {r.user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{r.user?.name || "Customer"}</p>
                    <p className="text-[11px] text-muted truncate">bought {r.product?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= QUICK DEALS ================= */}
      {lowStockDeals.length > 0 && (
        <section className="mt-12">
          <SectionHeader
            title="⚡ Quick deals"
            subtitle="Limited stock — grab them before they're gone"
            link="View all"
            onLink={() => navigate("/products")}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lowStockDeals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ================= AI + SELLER ================= */}
      <section className="mt-12 grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-light to-white rounded-3xl border border-primary/20 p-8 relative overflow-hidden">
          <span className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-primary/10" />
          <span className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-4">
            <Bot size={24} />
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold">
            Your AI shopping buddy 🧠
          </h3>
          <p className="text-muted text-sm mt-2 max-w-md">
            "Healthy breakfast ke liye kya lu?" — get instant curated suggestions with prices,
            combos & coupons. Bolo, hum samajh jayenge.
          </p>
          <Link
            to="/chat"
            className="mt-5 inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-primary-dark transition"
          >
            Start chatting <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-ink text-white rounded-3xl p-8 relative overflow-hidden">
          <span className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/20" />
          <span className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-2xl">
            🏪
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold">Own a shop in Indore?</h3>
          <p className="text-white/60 text-sm mt-2 max-w-md">
            Join Indore Bazar as a seller. List your products, manage orders & grow sales —
            all from one dashboard.
          </p>
          <Link
            to="/seller/dashboard"
            className="mt-5 inline-flex items-center gap-2 bg-white text-ink font-bold px-5 py-3 rounded-xl hover:bg-amber-300 transition"
          >
            Open your shop <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ================= SHOPS ================= */}
      <section className="mt-12">
        <SectionHeader
          title="Trusted local shops 🏪"
          subtitle="Handpicked kirana & stores from across Indore"
        />
        <div className="no-scrollbar flex gap-4 overflow-x-auto py-2">
          {shops.map((shop) => (
            <Link
              key={shop._id}
              to={`/shops/${shop._id}`}
              className="shrink-0 w-64 bg-white rounded-2xl border border-line p-5 hover:shadow-xl hover:-translate-y-0.5 transition"
            >
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-2xl bg-primary-light text-primary text-xl font-extrabold flex items-center justify-center">
                  {shop.name?.[0]?.toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-extrabold truncate">{shop.name}</p>
                  <p className="text-xs text-muted truncate">{shop.address}</p>
                </div>
              </div>
              <p className="text-xs text-muted mt-3 line-clamp-2">{shop.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                Visit shop <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
