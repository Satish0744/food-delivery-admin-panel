import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaShoppingBag,
  FaStore,
  FaMotorcycle,
  FaUsers,
  FaCreditCard,
  FaTag,
  FaHeadset,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  {
    label: "Orders",
    icon: FaShoppingBag,
    sub: [
      { to: "/admin/orders", label: "All Orders" },
      { to: "/admin/orders/refunds", label: "Refund Requests" },
    ],
  },
  {
    label: "Restaurants",
    icon: FaStore,
    sub: [
      { to: "/admin/restaurants", label: "All Restaurants" },
      { to: "/admin/restaurants/registrations", label: "Registrations" },
    ],
  },
  {
    label: "Delivery",
    icon: FaMotorcycle,
    sub: [
      { to: "/admin/delivery", label: "Partners" },
      { to: "/admin/delivery/tracking", label: "Live Tracking" },
    ],
  },
  { to: "/admin/customers", label: "Customers", icon: FaUsers },
  {
    label: "Payments",
    icon: FaCreditCard,
    sub: [
      { to: "/admin/payments/transactions", label: "Transactions" },
      { to: "/admin/payments/settlements", label: "Settlements" },
      { to: "/admin/payments/reports", label: "Financial Reports" },
    ],
  },
  {
    label: "Offers",
    icon: FaTag,
    sub: [
      { to: "/admin/offers", label: "All Offers" },
      { to: "/admin/offers/create", label: "Create Offer" },
    ],
  },
  {
    label: "Support",
    icon: FaHeadset,
    sub: [{ to: "/admin/support/tickets", label: "Tickets" }],
  },
  { to: "/admin/reports", label: "Reports", icon: FaChartBar },
  {
    label: "Settings",
    icon: FaCog,
    sub: [
      { to: "/admin/settings/platform", label: "Platform" },
      { to: "/admin/settings/roles", label: "Admin Roles" },
      { to: "/admin/settings/audit", label: "Audit Logs" },
    ],
  },
];

export default function Sidebar({ onNavigate }) {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("Logged out", "info");
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
            🍔
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-sm leading-tight">
              FoodHub
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV_ITEMS.map((item, i) => {
          if (item.sub) {
            return (
              <div key={i} className="pt-2">
                <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <item.icon />
                  {item.label}
                </div>
                <div className="ml-4 border-l border-gray-200 pl-2 space-y-0.5 mt-1">
                  {item.sub.map((s) => (
                    <NavLink
                      key={s.to}
                      to={s.to}
                      onClick={onNavigate}
                      end
                      className={({ isActive }) =>
                        `block px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-orange-50 hover:text-primary"
                        }`
                      }
                    >
                      {s.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-orange-50 hover:text-primary"
                }`
              }
            >
              <item.icon className="text-sm" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt /> Logout
        </motion.button>
      </div>
    </aside>
  );
}