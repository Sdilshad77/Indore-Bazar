import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Receipt, TicketPercent } from "lucide-react";

const LINKS = [
  { to: "/seller/dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} />, end: true },
  { to: "/seller/products", label: "Products", icon: <Package size={17} /> },
  { to: "/seller/orders", label: "Orders", icon: <Receipt size={17} /> },
  { to: "/seller/coupons", label: "Coupons", icon: <TicketPercent size={17} /> },
];

export default function ShopNav({ shopName }) {
  return (
    <div className="bg-white rounded-2xl border border-line p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-10 w-10 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center">
          {shopName?.[0]?.toUpperCase() || "S"}
        </span>
        <div>
          <p className="font-extrabold text-sm">Seller Portal</p>
          <p className="text-xs text-muted truncate">{shopName || "My Shop"}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:bg-primary-light hover:text-primary"
              }`
            }
          >
            {l.icon} {l.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}