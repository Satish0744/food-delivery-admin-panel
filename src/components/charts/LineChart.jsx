import { motion } from "framer-motion";

export default function LineChart({ data, height = 200, color = "#ff5200" }) {
  const width = 600;
  const padding = 40;
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = 0;
  const stepX = (width - padding * 2) / (data.length - 1);
  const stepY = (height - padding * 2) / (maxValue - minValue || 1);

  const points = data.map((d, i) => ({
    x: padding + i * stepX,
    y: height - padding - (d.value - minValue) * stepY,
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

  const areaD = `${pathD} L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id={`lineGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={width - padding}
            y1={padding + (height - padding * 2) * t}
            y2={padding + (height - padding * 2) * t}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        <motion.path
          d={areaD}
          fill={`url(#lineGrad-${color})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#fff"
            stroke={color}
            strokeWidth="2.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.05 }}
          />
        ))}

        {data.map((d, i) => (
          <text
            key={i}
            x={padding + i * stepX}
            y={height - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
            fontWeight="600"
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}