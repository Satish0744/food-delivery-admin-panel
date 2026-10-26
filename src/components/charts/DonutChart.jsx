import { motion } from "framer-motion";

export default function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 180 180" className="shrink-0">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="20" />
        {data.map((d, i) => {
          const fraction = d.value / total;
          const dash = fraction * circumference;
          const el = (
            <motion.circle
              key={i}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          );
          offset += dash;
          return el;
        })}
        <text x="90" y="86" textAnchor="middle" className="fill-gray-800" fontSize="20" fontWeight="800">
          {total}
        </text>
        <text x="90" y="104" textAnchor="middle" className="fill-gray-500" fontSize="10" fontWeight="600">
          TOTAL
        </text>
      </svg>
      <div className="flex-1 space-y-2 w-full">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-gray-700 font-medium">{d.label}</span>
            </div>
            <span className="font-bold text-gray-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}