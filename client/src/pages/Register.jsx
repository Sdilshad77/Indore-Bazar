import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { clearError, register } from "../store/slices/authSlice.js";
import Spinner from "../components/Spinner.jsx";
import { toastError, toastSuccess } from "../utils/toast.js";

const PHONE_REGEX = /^[0-9]{10}$/;

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toastError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    if (!PHONE_REGEX.test(form.phone)) {
      toastError("Please enter a valid 10-digit phone number");
      return;
    }
    if (form.password.length < 6) {
      toastError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== confirm) {
      toastError("Passwords do not match");
      return;
    }
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === "fulfilled") {
      toastSuccess("Account created! Welcome to Indore Bazar 🎉");
    }
  };

  const field =
    "w-full bg-surface rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/15 border border-transparent focus:border-primary transition";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-line shadow-xl shadow-primary/5 p-8 animate-fade-up">
          <div className="text-center mb-8">
            <img src="/favicon.svg" alt="" className="h-14 w-14 mx-auto rounded-2xl" />
            <h1 className="text-2xl font-extrabold mt-4 tracking-tight">Create your account ✨</h1>
            <p className="text-sm text-muted mt-1">Join Indore Bazar in under a minute</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wide">Full name</label>
              <div className="relative mt-1.5">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className={field}
                />
              </div>
            </div>

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
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wide">Phone number</label>
              <div className="relative mt-1.5">
                <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                  placeholder="9876543210"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wide">Delivery address</label>
              <div className="relative mt-1.5">
                <MapPin size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House no, street, area, Indore"
                  className={field}
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
                  placeholder="Minimum 6 characters"
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

            <div>
              <label className="text-xs font-bold text-muted uppercase tracking-wide">Confirm password</label>
              <div className="relative mt-1.5">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className={field}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl hover:bg-primary-dark active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              {isLoading ? <Spinner size="sm" light /> : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}