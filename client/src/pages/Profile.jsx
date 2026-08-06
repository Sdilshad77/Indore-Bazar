import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, Phone, ShoppingBag, Store, User as UserIcon } from "lucide-react";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
      <div className="bg-white rounded-3xl border border-line overflow-hidden animate-fade-up">
        <div className="h-28 bg-gradient-to-r from-primary to-emerald-600 relative">
          <div className="absolute -bottom-10 left-8">
            <span className="h-20 w-20 rounded-2xl bg-white border-4 border-white text-primary text-3xl font-extrabold flex items-center justify-center shadow-lg">
              {user.name?.[0]?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="pt-14 px-8 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight">{user.name}</h1>
            {user.isShopOwner && (
              <span className="text-[10px] font-bold bg-primary-light text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                <BadgeCheck size={12} /> Seller
              </span>
            )}
            {user.isAdmin && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                Admin
              </span>
            )}
          </div>
          <p className="text-sm text-muted">{user.email}</p>

          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <div className="bg-surface rounded-2xl p-4 flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary">
                <Phone size={18} />
              </span>
              <div>
                <p className="text-[10px] text-muted uppercase font-bold">Phone</p>
                <p className="font-bold text-sm">{user.phone}</p>
              </div>
            </div>
            <div className="bg-surface rounded-2xl p-4 flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary">
                <MapPin size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-muted uppercase font-bold">Address</p>
                <p className="font-bold text-sm truncate">{user.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <Link
              to="/orders"
              className="bg-primary text-white rounded-2xl p-5 hover:bg-primary-dark transition flex items-center gap-3"
            >
              <ShoppingBag size={22} />
              <div>
                <p className="font-extrabold">My Orders</p>
                <p className="text-xs text-white/80">Track & manage</p>
              </div>
            </Link>
            {user.isShopOwner && (
              <Link
                to="/seller/dashboard"
                className="bg-ink text-white rounded-2xl p-5 hover:bg-primary transition flex items-center gap-3"
              >
                <Store size={22} />
                <div>
                  <p className="font-extrabold">Seller Portal</p>
                  <p className="text-xs text-white/80">Manage shop</p>
                </div>
              </Link>
            )}
            {user.isAdmin && (
              <Link
                to="/admin"
                className="bg-amber-500 text-white rounded-2xl p-5 hover:bg-amber-600 transition flex items-center gap-3"
              >
                <UserIcon size={22} />
                <div>
                  <p className="font-extrabold">Admin Panel</p>
                  <p className="text-xs text-white/80">Manage platform</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}