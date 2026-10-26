import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaCheck, FaStar, FaCircle, FaMotorcycle } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import { formatCurrency } from "../../utils/helpers";

export default function PartnerList() {
  const { partners, verifyPartner, togglePartnerOnline } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = [...partners];
    if (filter === "online") list = list.filter((p) => p.online);
    if (filter === "offline") list = list.filter((p) => !p.online);
    if (filter === "unverified") list = list.filter((p) => !p.verified);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q));
    }
    return list;
  }, [partners, search, filter]);

  return (
    <div className="admin-container space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Delivery Partners</h2>
          <p className="text-sm text-gray-500">Manage your fleet of delivery partners</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "online", "offline", "unverified"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 opacity-70">
              ({f === "all" ? partners.length : f === "online" ? partners.filter(p => p.online).length : f === "offline" ? partners.filter(p => !p.online).length : partners.filter(p => !p.verified).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card-ui">
          <EmptyState icon="🛵" title="No partners found" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="card-ui p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.vehicle} · {p.vehicleNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <FaCircle className={`text-xs ${p.online ? "text-emerald-500" : "text-gray-300"}`} />
                  <span className="text-xs font-semibold">{p.online ? "Online" : "Offline"}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500">Rating</p>
                  <p className="font-bold text-yellow-600">{p.rating || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500">Deliveries</p>
                  <p className="font-bold">{p.totalDeliveries}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-500">Earnings</p>
                  <p className="font-bold">{formatCurrency(p.earnings)}</p>
                </div>
              </div>

              {!p.verified && (
                <div className="mb-2">
                  <Badge variant="warning">⚠ Unverified</Badge>
                </div>
              )}

              <div className="flex gap-1.5">
                <button
                  onClick={() => navigate(`/admin/delivery/${p.id}`)}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                >
                  <FaEye /> View
                </button>
                {!p.verified && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      verifyPartner(p.id);
                      showToast(`${p.name} verified`, "success");
                    }}
                    className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                  >
                    <FaCheck className="text-xs" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    togglePartnerOnline(p.id);
                    showToast("Status toggled", "info");
                  }}
                  className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <FaMotorcycle className="text-xs" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}