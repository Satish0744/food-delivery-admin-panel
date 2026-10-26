import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaEnvelope, FaPhone } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/ui/EmptyState";
import { formatDate } from "../../utils/helpers";

export default function Registrations() {
  const { restaurants, approveRestaurant, rejectRestaurant } = useAdminData();
  const { showToast } = useToast();

  const pending = useMemo(
    () => restaurants.filter((r) => r.status === "pending"),
    [restaurants]
  );

  return (
    <div className="admin-container space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold">Restaurant Registrations</h2>
        <p className="text-sm text-gray-500">
          Review and approve new restaurant registrations
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="card-ui">
          <EmptyState icon="✅" title="All caught up!" message="No pending restaurant registrations." />
        </div>
      ) : (
        <div className="grid gap-3">
          {pending.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="card-ui p-5"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {r.name[0]}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg">{r.name}</h3>
                      <p className="text-xs text-gray-500">{r.cuisine} · Owner: {r.owner}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-2">
                    <span className="flex items-center gap-1"><FaEnvelope /> {r.email}</span>
                    <span className="flex items-center gap-1"><FaPhone /> {r.phone}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">📍 {r.address}</p>
                  <p className="text-xs text-gray-400 mt-1">Registered: {formatDate(r.registeredAt)}</p>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      approveRestaurant(r.id);
                      showToast(`${r.name} approved!`, "success");
                    }}
                    className="btn-primary text-sm flex items-center gap-1.5 flex-1"
                  >
                    <FaCheck /> Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      rejectRestaurant(r.id);
                      showToast(`${r.name} rejected`, "error");
                    }}
                    className="btn-danger text-sm flex items-center gap-1.5 flex-1"
                  >
                    <FaTimes /> Reject
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}