import { motion } from "framer-motion";
import { FaCircle, FaMapMarkerAlt, FaMotorcycle, FaClock } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

export default function LiveTracking() {
  const { orders, partners } = useAdminData();

  const activeOrders = orders.filter((o) =>
    ["confirmed", "preparing", "out-for-delivery"].includes(o.status)
  );

  return (
    <div className="admin-container space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold">Live Tracking</h2>
        <p className="text-sm text-gray-500">Track active deliveries in real-time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Active Deliveries", value: activeOrders.filter(o => o.status === "out-for-delivery").length, color: "from-blue-400 to-blue-600" },
          { label: "In Preparation", value: activeOrders.filter(o => o.status === "preparing").length, color: "from-orange-400 to-orange-600" },
          { label: "Online Partners", value: partners.filter(p => p.online).length, color: "from-emerald-400 to-emerald-600" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-gradient-to-br ${s.color} rounded-xl p-5 text-white`}
          >
            <p className="text-xs opacity-80 uppercase">{s.label}</p>
            <p className="text-3xl font-extrabold mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {activeOrders.length === 0 ? (
        <div className="card-ui">
          <EmptyState icon="🛵" title="No active deliveries" message="All caught up!" />
        </div>
      ) : (
        <div className="grid gap-3">
          {activeOrders.map((o, i) => {
            const partner = partners.find((p) => p.name === o.partner);
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="card-ui p-4"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{o.id}</span>
                      <Badge variant={o.status === "out-for-delivery" ? "info" : "primary"}>
                        {o.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{o.customer.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt /> {o.address}
                    </p>
                  </div>
                  <div className="text-right">
                    {partner ? (
                      <>
                        <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                          <FaMotorcycle /> {partner.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                          <FaClock /> {partner.online ? "On route" : "Offline"}
                        </p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <FaCircle className={`text-xs ${partner.online ? "text-emerald-500" : "text-gray-300"}`} />
                          <span className="text-xs font-semibold">{partner.online ? "Active" : "Inactive"}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">Awaiting assignment</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}