import { motion } from "framer-motion";

export default function BarChart({ data, height = 200, color = "#ff5200" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 sm:gap-3 h-[200px]" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition">
              {d.value}
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 150, damping: 18 }}
              className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: color,
                minHeight: "4px",
              }}
            />
            <span className="text-[10px] sm:text-xs text-gray-600 font-medium text-center">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}