import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, change, color = "primary", trend = "up" }) {
  const colorMap = {
    primary: "from-orange-400 to-orange-600",
    success: "from-emerald-400 to-emerald-600",
    info: "from-blue-400 to-blue-600",
    warning: "from-amber-400 to-amber-600",
    danger: "from-red-400 to-red-600",
    purple: "from-purple-400 to-purple-600",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {value}
          </p>
          {change !== undefined && (
            <p className={`text-xs font-semibold mt-2 ${trend === "up" ? "text-success" : "text-danger"}`}>
              {trend === "up" ? "↑" : "↓"} {change}% vs last week
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shrink-0`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
}