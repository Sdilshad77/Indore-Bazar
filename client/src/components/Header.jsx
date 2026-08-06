import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bot, ChevronDown, LogOut, MapPin, Menu, Search, ShoppingCart, Store, User, X } from "lucide-react";
import { logout } from "../store/slices/authSlice.js";
import { resetCart } from "../store/slices/cartSlice.js";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop All" },
  { to: "/orders", label: "My Orders" },
  { to: "/chat", label: "AI Assistant" },
];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);

  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const cartCount = useMemo(
    () => (cart?.products || []).reduce((acc, item) => acc + (item.qty || 0), 0),
    [cart]
  );

  const suggestions = useMemo(() => {
    if (!query.trim() || query.trim().length < 1) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, products]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setQuery("");
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setShowMenu(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSearch(false);
    setQuery("");
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  const pickSuggestion = (name) => {
    setQuery("");
    setShowSearch(false);
    navigate(`/products?q=${encodeURIComponent(name)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line shadow-sm">
      <div className="bg-primary text-white text-xs font-semibold tracking-wide text-center py-1.5 px-4">
        🚀 FREE delivery on orders above ₹499 · Live in Indore
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/favicon.svg" alt="Indore Bazar" className="h-9 w-9 rounded-xl" />
            <div className="hidden sm:block leading-tight">
              <p className="font-extrabold text-lg text-primary tracking-tight">Indore Bazar</p>
              <p className="text-[10px] text-muted -mt-0.5">Fresh · Fast · AI-Powered</p>
            </div>
          </Link>

          {/* Location */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm text-muted border-r border-line pr-5">
            <MapPin size={16} className="text-primary" />
            <div>
              <p className="text-[10px] uppercase text-muted/70">Delivering to</p>
              <p className="font-semibold text-ink -mt-0.5">Indore, MP</p>
            </div>
          </div>

          {/* Search */}
          <form
            ref={searchRef}
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-xl hidden md:block"
          >
            <div className="flex items-center bg-surface rounded-full border border-line focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition overflow-hidden">
              <Search size={18} className="ml-4 text-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search "amul milk", "bread", "snacks"...'
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="pr-4 text-muted hover:text-ink"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-line overflow-hidden animate-pop z-50">
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => pickSuggestion(p.name)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface text-left transition"
                  >
                    <img src={p.productImage} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs text-muted">{p.category}</p>
                    </div>
                    <p className="text-sm font-bold text-primary">₹{p.price}</p>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="flex items-center gap-1.5 lg:gap-2 ml-auto">
            {/* Mobile search icon */}
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="md:hidden p-2.5 rounded-full hover:bg-surface text-ink"
            >
              <Search size={20} />
            </button>

            {/* AI Assistant */}
            <Link
              to="/chat"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold bg-primary-light text-primary-dark hover:bg-primary hover:text-white transition"
            >
              <Bot size={17} />
              <span className="hidden xl:inline">AI Assistant</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-surface text-ink transition"
              aria-label="Cart"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pop">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  className="flex items-center gap-1.5 p-2 rounded-full hover:bg-surface transition"
                >
                  <span className="h-8 w-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <ChevronDown size={15} className="text-muted hidden lg:block" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-line p-2 animate-pop z-50">
                    <div className="px-3 py-2 border-b border-line mb-1">
                      <p className="font-bold text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-muted truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-surface"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-surface"
                    >
                      <ShoppingCart size={16} /> My Orders
                    </Link>
                    {user?.isShopOwner && (
                      <Link
                        to="/seller/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-surface"
                      >
                        <Store size={16} /> Seller Portal
                      </Link>
                    )}
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-surface"
                      >
                        <Store size={16} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setShowMenu((s) => !s)}
              className="lg:hidden p-2.5 rounded-full hover:bg-surface"
              aria-label="Menu"
            >
              {showMenu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {showSearch && (
          <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden animate-fade-up">
            <div className="flex items-center bg-surface rounded-full border border-line focus-within:border-primary overflow-hidden">
              <Search size={17} className="ml-4 text-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </form>
        )}

        {/* Mobile nav */}
        {showMenu && (
          <nav className="lg:hidden mt-3 grid grid-cols-2 gap-2 animate-fade-up">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="text-sm font-semibold text-center px-4 py-2.5 rounded-xl bg-surface hover:bg-primary hover:text-white transition"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop nav */}
      <nav className="hidden lg:block border-t border-line">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 -mb-px">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                  isActive
                    ? "text-primary border-primary"
                    : "text-muted border-transparent hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}