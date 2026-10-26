import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaBell, FaSearch, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick, title = "Dashboard" }) {
  const { admin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New order ORD005 received", time: "2m ago" },
    { id: 2, text: "Restaurant Pasta Point registered", time: "15m ago" },
    { id: 3, text: "Refund request for ORD004", time: "1h ago" },
  ];

  const handleLogout = () => {
    logout();
    showToast("Logged out", "info");
    navigate("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <FaBars />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500 hidden sm:block">Welcome back, {admin?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search (desktop) */}
        <div className="relative hidden md:block">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            placeholder="Search..."
            className="pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 w-56"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <FaBell className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-2"
              >
                <p className="text-xs font-bold text-gray-500 uppercase px-2 py-1">Notifications</p>
                {notifications.map((n) => (
                  <div key={n.id} className="px-2 py-2 hover:bg-orange-50 rounded-lg cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">{n.text}</p>
                    <p className="text-xs text-gray-400">{n.time}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
              {admin?.name?.[0] || "A"}
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">
              {admin?.name}
            </span>
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1"
              >
                <Link
                  to="/admin/settings/platform"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  <FaUserCircle /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-sm font-semibold text-red-600"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}