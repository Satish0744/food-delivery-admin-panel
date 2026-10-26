import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaToggleOn, FaToggleOff, FaStar, FaUtensils, FaCheck, FaTimes } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import { formatCurrency } from "../../utils/helpers";

export default function RestaurantList() {
  const { restaurants, toggleRestaurantStatus, approveRestaurant, rejectRestaurant } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = [...restaurants];
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q)
      );
    }
    return list;
  }, [restaurants, search, statusFilter]);

  const statusVariant = {
    active: "success",
    inactive: "warning",
    pending: "info",
    rejected: "danger",
  };

  return (
    <div className="admin-container space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Restaurants</h2>
          <p className="text-sm text-gray-500">
            Manage all restaurants on the platform
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search restaurants..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "active", "pending", "inactive", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              statusFilter === s
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1.5 opacity-70">
              ({s === "all" ? restaurants.length : restaurants.filter((r) => r.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card-ui">
          <EmptyState icon="🏪" title="No restaurants found" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="card-ui p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.cuisine}</p>
                  </div>
                </div>
                <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Rating</p>
                  <p className="font-bold text-yellow-600 flex items-center gap-1">
                    <FaStar /> {r.rating}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Commission</p>
                  <p className="font-bold">{r.commission}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Orders</p>
                  <p className="font-bold">{r.totalOrders}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-500">Revenue</p>
                  <p className="font-bold">{formatCurrency(r.revenue)}</p>
                </div>
              </div>

              <div className="flex gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/admin/restaurants/${r.id}`)}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <FaEye /> View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/admin/restaurants/${r.id}/menu`)}
                  className="flex-1 bg-orange-50 text-primary hover:bg-orange-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                >
                  <FaUtensils /> Menu
                </motion.button>
                {r.status === "pending" ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        approveRestaurant(r.id);
                        showToast(`${r.name} approved`, "success");
                      }}
                      className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                    >
                      <FaCheck className="text-xs" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        rejectRestaurant(r.id);
                        showToast(`${r.name} rejected`, "error");
                      }}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <FaTimes className="text-xs" />
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      toggleRestaurantStatus(r.id);
                      showToast("Status toggled", "info");
                    }}
                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {r.status === "active" ? <FaToggleOn /> : <FaToggleOff />}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}