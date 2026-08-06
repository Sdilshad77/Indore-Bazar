import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Tag } from "lucide-react";
import { getProducts } from "../store/slices/productSlice.js";
import { getShopById, getShopCoupons } from "../store/slices/shopSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { ProductSkeleton } from "../components/Skeletons.jsx";

export default function ShopPage() {
  const { sid } = useParams();
  const dispatch = useDispatch();
  const { shop } = useSelector((state) => state.shops);
  const { products, isLoading } = useSelector((state) => state.products);
  const { coupons } = useSelector((state) => state.shops);

  useEffect(() => {
    dispatch(getShopById(sid));
    dispatch(getShopCoupons(sid));
    if (products.length === 0) dispatch(getProducts());
  }, [dispatch, sid, products.length]);

  const shopProducts = useMemo(
    () => products.filter((p) => p.shop?._id === sid),
    [products, sid]
  );

  if (!shop && !isLoading) {
    return (
      <EmptyState
        icon="🏪"
        title="Shop not found"
        action={
          <Link to="/" className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl">
            Go home
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      <Link
        to="/products"
        className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-5 transition"
      >
        <ArrowLeft size={16} /> All shops
      </Link>

      {/* Shop header */}
      {shop && (
        <div className="bg-white rounded-3xl border border-line p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/5" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <span className="h-20 w-20 rounded-3xl bg-primary text-white text-3xl font-extrabold flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
              {shop.name?.[0]?.toUpperCase()}
            </span>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{shop.name}</h1>
              <p className="text-muted text-sm mt-1 max-w-xl">{shop.description}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" /> {shop.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" /> {shop.shopPhone}
                </span>
              </div>
            </div>
            <div className="shrink-0 bg-primary-light rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-primary">{shopProducts.length}</p>
              <p className="text-[10px] text-muted font-semibold uppercase">Products</p>
            </div>
          </div>
        </div>
      )}

      {/* Coupons */}
      {coupons.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-extrabold mb-3 flex items-center gap-2">
            <Tag size={18} className="text-accent" /> Shop coupons
          </h2>
          <div className="flex flex-wrap gap-3">
            {coupons.map((c) => (
              <div key={c._id} className="bg-accent-light border border-dashed border-accent/50 rounded-2xl px-5 py-3 flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-extrabold text-accent text-lg">{c.couponCode}</p>
                  <p className="text-xs text-muted">{c.couponDiscount}% off your order</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-extrabold mb-4">Products from this shop</h2>
      {isLoading ? (
        <ProductSkeleton count={4} />
      ) : shopProducts.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="No products yet"
          subtitle="This shop hasn't listed any products yet. Check back soon!"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shopProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}