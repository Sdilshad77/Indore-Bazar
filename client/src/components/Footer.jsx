import { Link } from "react-router-dom";
import { Bot, Heart, MapPin, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg" />
            <p className="font-extrabold text-lg">Indore Bazar</p>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Fresh groceries delivered in minutes. AI-powered shopping, Indore-style.
          </p>
        </div>

        <div>
          <p className="font-bold mb-3 text-sm uppercase tracking-wide text-white/80">Shop</p>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">My Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
            <li><Link to="/chat" className="hover:text-white transition">AI Assistant</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-bold mb-3 text-sm uppercase tracking-wide text-white/80">Sell With Us</p>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/seller/dashboard" className="hover:text-white transition">Open a Shop</Link></li>
            <li><Link to="/profile" className="hover:text-white transition">Account</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-bold mb-3 text-sm uppercase tracking-wide text-white/80">Contact</p>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-center gap-2"><MapPin size={15} /> Indore, Madhya Pradesh</li>
            <li className="flex items-center gap-2"><ShoppingBag size={15} /> 7 AM – 11 PM, all days</li>
            <li className="flex items-center gap-2"><Bot size={15} /> Ask us anything — we chat!</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Indore Bazar · Made with <Heart size={11} className="inline text-red-500 fill-red-500" /> in Indore
      </div>
    </footer>
  );
}