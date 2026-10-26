import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShoppingBag,
  FaRupeeSign,
  FaUsers,
  FaStore,
  FaMotorcycle,
  FaArrowUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBoxOpen,
  FaWallet,
  FaStar,
  FaTicketAlt,
  FaChevronRight,
  FaFire,
  FaChartLine,
} from "react-icons/fa";
import StatCard from "../../components/ui/StatCard";
import LineChart from "../../components/charts/LineChart";
import DonutChart from "../../components/charts/DonutChart";
import Badge from "../../components/ui/Badge";
import { useAdminData } from "../../context/AdminDataContext";
import { salesData, ordersTrend, peakHours } from "../../data/analytics";
import { formatCurrency, timeAgo } from "../../utils/helpers";

// ═══════════════════════════════════════════════════════
// CANDLE CHART COMPONENT (in-file, no new file needed)
// ═══════════════════════════════════════════════════════
function CandleChart({ data, color = "#ff5200", height = 220 }) {
  const width = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values) * 1.15;
  const minValue = 0;

  const slotW = innerW / data.length;
  const candleW = Math.min(slotW * 0.45, 26);

  const yPos = (val) =>
    padding.top + innerH - ((val - minValue) / (maxValue - minValue)) * innerH;

  // Generate y-axis gridlines
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = minValue + ((maxValue - minValue) / gridCount) * i;
    return { y: yPos(val), val };
  });

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gridlines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={g.y}
              y2={g.y}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={g.y + 3}
              textAnchor="end"
              fontSize="9"
              fill="#9ca3af"
              fontWeight="600"
            >
              {Math.round(g.val)}
            </text>
          </g>
        ))}

        {/* Candles */}
        {data.map((d, i) => {
          const cx = padding.left + slotW * i + slotW / 2;
          // Simulate open/close around the value for candle body
          const open = d.value * (1 - 0.12 - Math.random() * 0.06);
          const close = d.value * (1 + 0.02 + Math.random() * 0.05);
          const high = Math.max(open, close, d.value) * (1 + 0.04);
          const low = Math.min(open, close) * (1 - 0.05);

          const isUp = close >= open;
          const bodyTop = yPos(Math.max(open, close));
          const bodyBottom = yPos(Math.min(open, close));
          const bodyHeight = Math.max(Math.abs(bodyBottom - bodyTop), 3);
          const wickTop = yPos(high);
          const wickBottom = yPos(low);

          const candleColor = isUp ? "#10b981" : "#ef4444";
          const useColor = color && isUp ? color : candleColor;

          return (
            <g key={i}>
              {/* Wick */}
              <motion.line
                x1={cx}
                x2={cx}
                y1={wickTop}
                y2={wickBottom}
                stroke={useColor}
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              />
              {/* Body */}
              <motion.rect
                x={cx - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyHeight}
                rx="2"
                fill={useColor}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                style={{ transformOrigin: `${cx}px ${bodyTop + bodyHeight / 2}px` }}
                transition={{
                  delay: i * 0.08 + 0.15,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 180,
                }}
              />
              {/* Value on top */}
              <motion.text
                x={cx}
                y={wickTop - 6}
                textAnchor="middle"
                fontSize="9"
                fill="#111827"
                fontWeight="800"
                initial={{ opacity: 0, y: wickTop - 2 }}
                animate={{ opacity: 1, y: wickTop - 6 }}
                transition={{ delay: i * 0.08 + 0.3 }}
              >
                {d.value}
              </motion.text>
              {/* X label */}
              <text
                x={cx}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                fontWeight="600"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate = useNavigate();
  const { orders, restaurants, partners, customers, activityLog, tickets } =
    useAdminData();

  // ═══════════ COMPREHENSIVE STATS ═══════════
  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "delivered");
    const cancelled = orders.filter((o) => o.status === "cancelled");
    const activeOrders = orders.filter((o) =>
      ["placed", "confirmed", "preparing", "out-for-delivery"].includes(o.status)
    );
    const totalRevenue = delivered.reduce((s, o) => s + o.amount, 0);
    const avgOrderValue = orders.length
      ? Math.round(orders.reduce((s, o) => s + o.amount, 0) / orders.length)
      : 0;
    const commission = Math.round(totalRevenue * 0.18);
    const refunds = orders.filter((o) => o.refundStatus === "pending").length;
    const openTickets = tickets.filter((t) => t.status === "open").length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      activeOrders: activeOrders.length,
      deliveredOrders: delivered.length,
      cancelledOrders: cancelled.length,
      activeUsers: customers.filter((c) => c.status === "active").length,
      activeRestaurants: restaurants.filter((r) => r.status === "active").length,
      onlinePartners: partners.filter((p) => p.online).length,
      totalPartners: partners.length,
      avgOrderValue,
      commission,
      refunds,
      openTickets,
    };
  }, [orders, restaurants, partners, customers, tickets]);

  // ═══════════ TOP PERFORMERS ═══════════
  const topRestaurants = useMemo(
    () =>
      [...restaurants]
        .filter((r) => r.status === "active")
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    [restaurants]
  );

  const topPartners = useMemo(
    () =>
      [...partners]
        .filter((p) => p.verified)
        .sort((a, b) => b.totalDeliveries - a.totalDeliveries)
        .slice(0, 5),
    [partners]
  );

  const recentOrders = orders.slice(0, 6);
  const pendingRefunds = orders.filter((o) => o.refundStatus === "pending");

  const statusColor = {
    placed: "warning",
    confirmed: "info",
    preparing: "primary",
    "out-for-delivery": "info",
    delivered: "success",
    cancelled: "danger",
  };

  // ═══════════ CHART DATA ═══════════
  const peakHoursDetailed = peakHours.map((h) => ({
    label: h.hour,
    value: h.orders,
  }));

  // Category Split — SINGLE source of truth (used for donut only now)
  const categorySplitData = [
    { label: "North Indian", value: 42, color: "#ff5200" },
    { label: "South Indian", value: 22, color: "#10b981" },
    { label: "Chinese", value: 15, color: "#3b82f6" },
    { label: "Biryani", value: 12, color: "#f59e0b" },
    { label: "Others", value: 9, color: "#8b5cf6" },
  ];

  // ═══════════ CLICKABLE STAT CARDS CONFIG ═══════════
  const primaryCards = [
    {
      icon: FaShoppingBag,
      label: "Total Orders",
      value: stats.totalOrders,
      change: 12.4,
      color: "primary",
      path: "/admin/orders",
    },
    {
      icon: FaRupeeSign,
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: 8.7,
      color: "success",
      path: "/admin/payments/reports",
    },
    {
      icon: FaUsers,
      label: "Active Users",
      value: stats.activeUsers,
      change: 5.2,
      color: "info",
      path: "/admin/customers",
    },
    {
      icon: FaStore,
      label: "Active Restaurants",
      value: stats.activeRestaurants,
      change: 2.8,
      color: "warning",
      path: "/admin/restaurants",
    },
  ];

  const secondaryCards = [
    {
      icon: FaBoxOpen,
      label: "Active Orders",
      value: stats.activeOrders,
      color: "text-primary",
      bg: "bg-orange-50",
      path: "/admin/orders",
    },
    {
      icon: FaCheckCircle,
      label: "Delivered",
      value: stats.deliveredOrders,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      path: "/admin/orders",
    },
    {
      icon: FaTimesCircle,
      label: "Cancelled",
      value: stats.cancelledOrders,
      color: "text-red-600",
      bg: "bg-red-50",
      path: "/admin/orders",
    },
    {
      icon: FaWallet,
      label: "Commission",
      value: formatCurrency(stats.commission),
      color: "text-blue-600",
      bg: "bg-blue-50",
      path: "/admin/payments/settlements",
    },
    {
      icon: FaMotorcycle,
      label: "Online Partners",
      value: `${stats.onlinePartners}/${stats.totalPartners}`,
      color: "text-purple-600",
      bg: "bg-purple-50",
      path: "/admin/delivery",
    },
    {
      icon: FaTicketAlt,
      label: "Open Tickets",
      value: stats.openTickets,
      color: "text-amber-600",
      bg: "bg-amber-50",
      path: "/admin/support/tickets",
    },
  ];

  return (
    <div className="admin-container space-y-6">
      {/* ═══════════ WELCOME HEADER ═══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete business snapshot · Updated just now
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs font-bold text-emerald-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* ═══════════ PRIMARY STAT CARDS (Clickable) ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryCards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className="cursor-pointer"
          >
            <StatCard
              icon={card.icon}
              label={card.label}
              value={card.value}
              change={card.change}
              color={card.color}
            />
          </div>
        ))}
      </div>

      {/* ═══════════ SECONDARY STAT CARDS (Clickable) ═══════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {secondaryCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(s.path)}
            className="card-ui p-4 cursor-pointer hover:shadow-md transition-all"
          >
            <div
              className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center ${s.color} mb-2`}
            >
              <s.icon className="text-sm" />
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">
              {s.label}
            </p>
            <p className="text-lg font-extrabold text-gray-900 mt-0.5">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ═══════════ SALES OVERVIEW + CATEGORY SPLIT ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <div className="lg:col-span-2 card-ui p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">
                Sales Overview
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Daily revenue trend · This week
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  This Week
                </p>
                <p className="text-lg font-extrabold text-gray-900">
                  {formatCurrency(
                    salesData.reduce((s, d) => s + d.value, 0)
                  )}
                </p>
              </div>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <FaArrowUp /> 8% vs last
              </span>
            </div>
          </div>
          <LineChart data={salesData} color="#ff5200" height={240} />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Peak Day
              </p>
              <p className="font-bold text-gray-900 text-sm">Saturday</p>
              <p className="text-xs text-emerald-600 font-semibold">₹32,000</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Avg/Day
              </p>
              <p className="font-bold text-gray-900 text-sm">
                {formatCurrency(
                  Math.round(
                    salesData.reduce((s, d) => s + d.value, 0) / 7
                  )
                )}
              </p>
              <p className="text-xs text-gray-500">Across 7 days</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Growth
              </p>
              <p className="font-bold text-gray-900 text-sm flex items-center gap-1">
                <FaArrowUp className="text-emerald-500 text-xs" /> +8.2%
              </p>
              <p className="text-xs text-gray-500">vs last week</p>
            </div>
          </div>
        </div>

        {/* Category Split — DONUT ONLY (no duplicate list) */}
        <div className="card-ui p-5 flex flex-col">
          <div className="mb-4">
            <h2 className="font-extrabold text-gray-900 text-lg">
              Category Split
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Revenue distribution by cuisine
            </p>
          </div>

          <div className="flex justify-center my-4">
            <DonutChart data={categorySplitData} size={200} />
          </div>

          {/* Compact summary at bottom — no full list repeat */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-semibold">
                Total Categories
              </span>
              <span className="font-extrabold text-gray-900">
                {categorySplitData.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-gray-500 font-semibold">Top Cuisine</span>
              <span className="font-extrabold text-primary">
                {categorySplitData[0].label} ({categorySplitData[0].value}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ PEAK HOURS + WEEKLY ORDERS (CANDLE CHARTS) ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Peak Hours — Candle Chart */}
        <div className="card-ui p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <FaFire className="text-primary" /> Peak Hours
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Order volume by hour · Today
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Peak
              </p>
              <p className="text-lg font-extrabold text-primary">8 PM</p>
              <p className="text-xs text-gray-500">125 orders</p>
            </div>
          </div>
          <CandleChart data={peakHoursDetailed} color="#ff5200" height={230} />
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Morning
              </p>
              <p className="font-bold text-sm">45</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Afternoon
              </p>
              <p className="font-bold text-sm">191</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Evening
              </p>
              <p className="font-bold text-sm text-primary">395</p>
            </div>
          </div>
        </div>

        {/* Weekly Orders — Candle Chart */}
        <div className="card-ui p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <FaChartLine className="text-emerald-500" /> Weekly Orders
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Total orders per week
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Total
              </p>
              <p className="text-lg font-extrabold text-gray-900">
                {ordersTrend.reduce((s, d) => s + d.value, 0)}
              </p>
              <p className="text-xs text-emerald-600 font-semibold">
                ↑ 12% MoM
              </p>
            </div>
          </div>
          <CandleChart
            data={ordersTrend.map((d) => ({
              label: d.label,
              value: d.value,
            }))}
            color="#10b981"
            height={230}
          />
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Highest
              </p>
              <p className="font-bold text-sm text-emerald-600">395</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Avg
              </p>
              <p className="font-bold text-sm">
                {Math.round(
                  ordersTrend.reduce((s, d) => s + d.value, 0) /
                    ordersTrend.length
                )}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Growth
              </p>
              <p className="font-bold text-sm text-emerald-600">+12.3%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ TOP RESTAURANTS + TOP PARTNERS ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Restaurants */}
        <div className="card-ui p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">
                Top Restaurants
              </h2>
              <p className="text-xs text-gray-500">By revenue</p>
            </div>
            <button
              onClick={() => navigate("/admin/restaurants")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View all <FaChevronRight className="text-[8px]" />
            </button>
          </div>
          <div className="space-y-2">
            {topRestaurants.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 3 }}
                onClick={() => navigate(`/admin/restaurants/${r.id}`)}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange-50 transition cursor-pointer"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    i === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : i === 1
                      ? "bg-gray-200 text-gray-700"
                      : i === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {r.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{r.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaStar className="text-yellow-500 text-[9px]" />{" "}
                    {r.rating} · {r.cuisine}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-gray-900">
                    {formatCurrency(r.revenue)}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {r.totalOrders} orders
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Delivery Partners */}
        <div className="card-ui p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">
                Top Partners
              </h2>
              <p className="text-xs text-gray-500">By delivery count</p>
            </div>
            <button
              onClick={() => navigate("/admin/delivery")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View all <FaChevronRight className="text-[8px]" />
            </button>
          </div>
          <div className="space-y-2">
            {topPartners.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 3 }}
                onClick={() => navigate(`/admin/delivery/${p.id}`)}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-orange-50 transition cursor-pointer"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    i === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : i === 1
                      ? "bg-gray-200 text-gray-700"
                      : i === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaStar className="text-yellow-500 text-[9px]" />{" "}
                    {p.rating} ·{" "}
                    {p.online ? (
                      <span className="text-emerald-600 font-semibold">
                        Online
                      </span>
                    ) : (
                      <span className="text-gray-400">Offline</span>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-gray-900">
                    {p.totalDeliveries}
                  </p>
                  <p className="text-[10px] text-gray-500">deliveries</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ RECENT ORDERS + ACTIVITY ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="card-ui p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-500">
                Latest {recentOrders.length} orders
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View all <FaChevronRight className="text-[8px]" />
            </button>
          </div>
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <motion.div
                key={o.id}
                whileHover={{ x: 3 }}
                onClick={() => navigate(`/admin/orders/${o.id}`)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-orange-50 transition cursor-pointer border border-transparent hover:border-orange-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <FaShoppingBag className="text-gray-600 text-xs" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{o.id}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {o.customer.name} · {o.restaurant}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="font-bold text-sm">
                    {formatCurrency(o.amount)}
                  </p>
                  <Badge variant={statusColor[o.status]}>
                    {o.status.replace("-", " ")}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-ui p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">
                Recent Activity
              </h2>
              <p className="text-xs text-gray-500">Latest admin actions</p>
            </div>
            <button
              onClick={() => navigate("/admin/settings/audit")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View all <FaChevronRight className="text-[8px]" />
            </button>
          </div>
          {activityLog.length === 0 ? (
            <div className="text-center py-8">
              <FaClock className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                No activity yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Admin actions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {activityLog.slice(0, 10).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium leading-snug">
                      {a.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {timeAgo(a.at)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ REFUNDS + QUICK ACTIONS ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending Refunds */}
        <div className="lg:col-span-2 card-ui p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">
                Pending Refunds
              </h2>
              <p className="text-xs text-gray-500">
                {pendingRefunds.length} refund
                {pendingRefunds.length !== 1 ? "s" : ""} awaiting action
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/orders/refunds")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Manage <FaChevronRight className="text-[8px]" />
            </button>
          </div>
          {pendingRefunds.length === 0 ? (
            <div className="text-center py-8">
              <FaCheckCircle className="text-4xl text-emerald-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                All caught up!
              </p>
              <p className="text-xs text-gray-400 mt-1">
                No pending refunds
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingRefunds.map((o) => (
                <motion.div
                  key={o.id}
                  whileHover={{ x: 3 }}
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <FaClock className="text-amber-600 text-sm shrink-0" />
                    <div>
                      <p className="font-bold text-sm">{o.id}</p>
                      <p className="text-xs text-gray-600">
                        {o.customer.name} · {o.restaurant}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-amber-700">
                      {formatCurrency(o.amount)}
                    </p>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-ui p-5">
          <h2 className="font-extrabold text-gray-900 text-lg mb-1">
            Quick Actions
          </h2>
          <p className="text-xs text-gray-500 mb-4">Jump to common tasks</p>
          <div className="space-y-2">
            {[
              {
                label: "Create Offer",
                icon: FaTicketAlt,
                path: "/admin/offers/create",
                color: "text-primary bg-orange-50",
              },
              {
                label: "View Orders",
                icon: FaShoppingBag,
                path: "/admin/orders",
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "Add Restaurant",
                icon: FaStore,
                path: "/admin/restaurants/registrations",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Track Delivery",
                icon: FaMotorcycle,
                path: "/admin/delivery/tracking",
                color: "text-purple-600 bg-purple-50",
              },
              {
                label: "View Reports",
                icon: FaChartLine,
                path: "/admin/reports",
                color: "text-amber-600 bg-amber-50",
              },
            ].map((a, i) => (
              <button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(a.path)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition border border-gray-100"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center shrink-0`}
                >
                  <a.icon className="text-sm" />
                </div>
                <span className="text-sm font-semibold text-gray-700 flex-1 text-left">
                  {a.label}
                </span>
                <FaChevronRight className="text-[9px] text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}