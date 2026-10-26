import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaStore, FaMotorcycle, FaRupeeSign } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { formatCurrency } from "../../utils/helpers";

export default function Settlements() {
  const { restaurants, partners } = useAdminData();

  const restaurantSettlements = useMemo(
    () =>
      restaurants
        .filter((r) => r.status === "active")
        .map((r) => ({
          ...r,
          payout: Math.round(r.revenue * (1 - r.commission / 100)),
          commission: Math.round(r.revenue * (r.commission / 100)),
        })),
    [restaurants]
  );

  return (
    <div className="admin-container space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold">Settlements</h2>
        <p className="text-sm text-gray-500">Restaurant & delivery partner payouts</p>
      </div>

      <div className="card-ui p-5">
        <h3 className="font-bold mb-1 flex items-center gap-2">
          <FaStore className="text-primary" /> Restaurant Settlements
        </h3>
        <p className="text-xs text-gray-500 mb-4">Revenue after platform commission</p>
        <div className="space-y-2">
          {restaurantSettlements.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 rounded-lg border border-gray-100 hover:border-primary/40 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{r.name}</p>
                  <p className="text-xs text-gray-500">
                    Revenue: {formatCurrency(r.revenue)} · Commission: {r.commission}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Payout</p>
                  <p className="text-lg font-extrabold text-emerald-600">
                    {formatCurrency(r.payout)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card-ui p-5">
        <h3 className="font-bold mb-1 flex items-center gap-2">
          <FaMotorcycle className="text-primary" /> Delivery Partner Payouts
        </h3>
        <p className="text-xs text-gray-500 mb-4">Weekly earnings summary</p>
        <div className="space-y-2">
          {partners.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 rounded-lg border border-gray-100 hover:border-primary/40 transition flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {p.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.totalDeliveries} deliveries · {p.vehicle}
                  </p>
                </div>
              </div>
              <p className="font-extrabold text-emerald-600">{formatCurrency(p.earnings)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}