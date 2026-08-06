import { useNavigate, useSearchParams } from "react-router-dom";
import { categoryMeta } from "../utils/format.js";

export default function CategoryChips({ categories }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const active = params.get("category") || "All";

  const items = [
    { name: "All", emoji: "✨", color: "#eef2f1" },
    ...categories.map((c) => ({ name: c, ...categoryMeta(c) })),
  ];

  const select = (name) => {
    if (name === "All") {
      navigate("/products");
    } else {
      navigate(`/products?category=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto py-1">
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => select(item.name)}
          className={`shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all ${
            active === item.name
              ? "border-primary bg-primary-light shadow-sm"
              : "border-line bg-white hover:border-primary/40"
          }`}
        >
          <span
            className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: item.color }}
          >
            {item.emoji}
          </span>
          <span
            className={`text-xs font-bold ${
              active === item.name ? "text-primary" : "text-ink"
            }`}
          >
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}