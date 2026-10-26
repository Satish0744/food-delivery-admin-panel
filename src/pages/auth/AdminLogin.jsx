import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaChartLine,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "admin@foodhub.com",
    password: "admin123",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(form.email, form.password);
      setLoading(false);
      showToast(res.message, res.success ? "success" : "error");
      if (res.success) navigate("/admin/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ───────── LEFT — BRAND PANEL ───────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-black"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Brand logo — FIXED: properly sized, aligned */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/40 shrink-0">
              <span className="text-xl leading-none">🍔</span>
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-white text-lg">
                Food<span className="text-primary">Hub</span>
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Admin Console
              </p>
            </div>
          </div>

          {/* Hero copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] mb-4"
            >
              Manage your entire
              <br />
              <span className="text-primary">food empire</span>
              <br />
              from one place.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-base max-w-md leading-relaxed"
            >
              Track orders, manage restaurants, monitor deliveries, and grow
              revenue — all with a powerful admin dashboard.
            </motion.p>

            {/* Feature pills */}
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
              {[
                { icon: FaBolt, label: "Real-time Orders" },
                { icon: FaChartLine, label: "Live Analytics" },
                { icon: FaShieldAlt, label: "Secure Access" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center"
                >
                  <f.icon className="text-primary text-lg mx-auto mb-1.5" />
                  <p className="text-[10px] font-semibold text-gray-300 leading-tight">
                    {f.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer status */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </motion.div>

      {/* ───────── RIGHT — LOGIN FORM ───────── */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 mb-3">
              <span className="text-2xl leading-none">🍔</span>
            </div>
            <p className="font-extrabold text-xl text-gray-900">
              Food<span className="text-primary">Hub</span>
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
              Admin Console
            </p>
          </div>

          {/* ─── Heading ─── */}
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              Welcome back 👋
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10" />
                <input
                  id="admin-email"
                  type="email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@foodhub.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wide"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showToast("Contact your superadmin to reset", "info")
                  }
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10" />
                <input
                  id="admin-password"
                  type={showPwd ? "text" : "password"}
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition p-1.5 rounded-md hover:bg-gray-100 z-10"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-gray-600">Keep me signed in</span>
            </label>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <FaArrowRight className="text-sm" />
                </>
              )}
            </motion.button>
          </form>

          {/* ─── Divider ─── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
              Demo Access
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ─── Demo credentials ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FaShieldAlt /> Demo Credentials
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 shrink-0">
                  📧 Email
                </span>
                <span className="font-mono font-semibold text-gray-900 text-xs bg-white/60 px-2 py-1 rounded truncate">
                  admin@foodhub.com
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 shrink-0">
                  🔑 Password
                </span>
                <span className="font-mono font-semibold text-gray-900 text-xs bg-white/60 px-2 py-1 rounded">
                  admin123
                </span>
              </div>
            </div>
          </motion.div>

          {/* ─── Footer ─── */}
          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} FoodHub Admin · All rights reserved
          </p>
        </motion.div>
      </div>
    </div>
  );
}