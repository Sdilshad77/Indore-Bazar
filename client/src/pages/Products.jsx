import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getProducts } from "../store/slices/productSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import CategoryChips from "../components/CategoryChips.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { ProductSkeleton } from "../components/Skeletons.jsx";

const SORTS = [
  { key: "popular", label: "Popular" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Name: A to Z" },
];

export default function Products() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { products, isLoading } = useSelector((state) => state.products);

  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.shop?.name?.toLowerCase().includes(query)
      );
    }
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [products, category, q, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6">
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {q ? (
            <>
              Results for <span className="text-primary">"{q}"</span>
            </>
          ) : (
            <>
              {category === "All" ? "All products" : `${category} aisle`}
            </>
          )}
        </h1>
        <p className="text-sm text-muted mt-1">{filtered.length} products available</p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = new FormData(e.target).get("q")?.toString() || "";
          const next = new URLSearchParams(params);
          if (v) next.set("q", v);
          else next.delete("q");
          setParams(next);
        }}
        className="mb-5 flex items-center gap-2"
      >
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            defaultValue={q}
            name="q"
            placeholder="Search by product, category or shop..."
            className="w-full bg-white border border-line rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary-dark transition"
        >
          Search
        </button>
      </form>

      {/* Category chips */}
      <div className="mb-5">
        <CategoryChips categories={categories} />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-muted">
          <SlidersHorizontal size={15} /> Sort:
        </span>
        <div className="flex flex-wrap gap-2">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                sort === s.key
                  ? "border-primary bg-primary-light text-primary"
                  : "border-line bg-white text-muted hover:border-primary/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ProductSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No products found"
          subtitle="Try a different search term or category."
          action={
            <button
              onClick={() => setParams({})}
              className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark"
            >
              <X size={16} /> Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}