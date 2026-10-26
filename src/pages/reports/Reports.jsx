import { useMemo } from "react";
import { motion } from "framer-motion";
import LineChart from "../../components/charts/LineChart";
import BarChart from "../../components/charts/BarChart";
import { useAdminData } from "../../context/AdminDataContext";
import { salesData, peakHours } from "../../data/analytics";
import { formatCurrency } from "../../utils/helpers";

export default function Reports() {
  const { orders, restaurants, partners, customers } = useAdminData();

  const summary = useMemo(() => ({
    revenue: orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.amount, 0),
    orderCount: orders.length,
    avgOrder: orders.length ? Math.round(orders.reduce((s, o) => s + o.amount, 0) / orders.length) : 0,
    activeRestaurants: restaurants.filter(r => r.status === "active").length,
    activePartners: partners.filter(p => p.online).length,
    totalCustomers: customers.length,
  }), [orders, restaurants, partners, customers]);

  return (
    <div className="admin-container space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold">Reports & Analytics</h2>
        <p className="text-sm text-gray-500">Platform-wide performance metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: "Total Revenue", value: formatCurrency(summary.revenue), color: "text-emerald-600" },
          { label: "Total Orders", value: summary.orderCount, color: "text-primary" },
          { label: "Avg. Order Value", value: formatCurrency(summary.avgOrder), color: "text-blue-600" },
          { label: "Active Restaurants", value: summary.activeRestaurants, color: "text-amber-600" },
          { label: "Online Partners", value: summary.activePartners, color: "text-purple-600" },
          { label: "Total Customers", value: summary.totalCustomers, color: "text-pink-600" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-ui p-4"
          >
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`text-xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-ui p-5">
        <h3 className="font-bold mb-1">Weekly Sales</h3>
        <p className="text-xs text-gray-500 mb-4">Revenue per day</p>
        <LineChart data={salesData} color="#ff5200" />
      </div>

      <div className="card-ui p-5">
        <h3 className="font-bold mb-1">Peak Hours</h3>
        <p className="text-xs text-gray-500 mb-4">Orders by hour of the day</p>
        <BarChart data={peakHours} color="#10b981" />
      </div>
    </div>
  );
}