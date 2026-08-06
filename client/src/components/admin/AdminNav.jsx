import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Store, Users } from "lucide-react";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} />, end: true },
  { to: "/admin/users", label: "Users", icon: <Users size={17} /> },
  { to: "/admin/orders", label: "Orders", icon: <Package size={17} /> },
  { to: "/admin/shops", label: "Shops", icon: <Store size={17} /> },
];

export default function AdminNav() {
  return (
    <div className="bg-white rounded-2xl border border-line p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-10 w-10 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center">
          A
        </span>
        <div>
          <p className="font-extrabold text-sm">Admin Panel</p>
          <p className="text-xs text-muted">Indore Bazar platform</p>
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
                  ? "bg-amber-500 text-white"
                  : "bg-surface text-muted hover:bg-amber-50 hover:text-amber-600"
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