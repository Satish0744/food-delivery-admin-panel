import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("orders/refunds")) return "Refund Requests";
    if (path.includes("orders")) return "Orders";
    if (path.includes("restaurants/registrations")) return "Restaurant Registrations";
    if (path.includes("restaurants")) return "Restaurants";
    if (path.includes("delivery/tracking")) return "Live Tracking";
    if (path.includes("delivery")) return "Delivery Partners";
    if (path.includes("customers")) return "Customers";
    if (path.includes("payments/transactions")) return "Transactions";
    if (path.includes("payments/settlements")) return "Settlements";
    if (path.includes("payments/reports")) return "Financial Reports";
    if (path.includes("offers/create")) return "Create Offer";
    if (path.includes("offers")) return "Offers & Promotions";
    if (path.includes("support")) return "Support Tickets";
    if (path.includes("reports")) return "Reports";
    if (path.includes("settings/platform")) return "Platform Settings";
    if (path.includes("settings/roles")) return "Admin Roles";
    if (path.includes("settings/audit")) return "Audit Logs";
    return "Admin";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} title={getTitle()} />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}