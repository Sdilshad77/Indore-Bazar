import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { clearError, login } from "../store/slices/authSlice.js";
import Spinner from "../components/Spinner.jsx";
import { toastError, toastSuccess } from "../utils/toast.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toastError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === "fulfilled") {
      toastSuccess(`Welcome back, ${res.payload.name}! 🎉`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-line shadow-xl shadow-primary/5 p-8 animate-fade-up">
          <div className="text-center mb-8">
            <img src="/favicon.svg" alt="" className="h-14 w-14 mx-auto rounded-2xl" />
            <h1 className="text-2xl font-extrabold mt-4 tracking-tight">Welcome back 👋</h1>
            <p className="text-sm text-muted mt-1">Login to shop & chat with AI assistant</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wide">Email</label>
              <div className="relative mt-1.5">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-surface rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wide">Password</label>
              <div className="relative mt-1.5">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-surface rounded-2xl pl-11 pr-11 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-ink"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl hover:bg-primary-dark active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              {isLoading ? <Spinner size="sm" light /> : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            New to Indore Bazar?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <div className="mt-5 bg-primary-light rounded-2xl p-4 flex items-center gap-3 animate-fade-up">
          <span className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </span>
          <p className="text-xs text-primary-dark font-medium">
            Login to unlock AI shopping assistant, faster checkout & exclusive coupon deals! 🎁
          </p>
        </div>
      </div>
    </div>
  );
}