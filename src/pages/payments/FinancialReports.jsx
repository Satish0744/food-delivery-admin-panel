import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaRupeeSign, FaStore, FaMotorcycle, FaUserTie } from "react-icons/fa";
import BarChart from "../../components/charts/BarChart";
import { useAdminData } from "../../context/AdminDataContext";
import { formatCurrency } from "../../utils/helpers";

export default function FinancialReports() {
  const { transactions } = useAdminData();

  const stats = useMemo(() => {
    const gross = transactions.reduce((s, t) => s + (t.status === "success" ? t.amount : 0), 0);
    const commission = transactions.reduce((s, t) => s + (t.commission || 0), 0);
    return { gross, commission, net: gross - commission };
  }, [transactions]);

  const monthlyData = [
    { label: "Aug", value: 48000 },
    { label: "Sep", value: 62000 },
    { label: "Oct", value: 74000 },
    { label: "Nov", value: 89000 },
    { label: "Dec", value: 105000 },
    { label: "Jan", value: 98000 },
  ];

  return (
    <div className="admin-container space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold">Financial Reports</h2>
        <p className="text-sm text-gray-500">Platform revenue and financial overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Gross Revenue", value: formatCurrency(stats.gross), icon: FaRupeeSign, color: "from-emerald-400 to-emerald-600" },
          { label: "Platform Commission", value: formatCurrency(stats.commission), icon: FaUserTie, color: "from-blue-400 to-blue-600" },
          { label: "Net Profit", value: formatCurrency(stats.net), icon: FaRupeeSign, color: "from-primary to-secondary" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-gradient-to-br ${s.color} rounded-xl p-5 text-white`}
          >
            <s.icon className="text-2xl opacity-80 mb-2" />
            <p className="text-xs opacity-90 uppercase">{s.label}</p>
            <p className="text-2xl font-extrabold mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-ui p-5">
        <h3 className="font-bold mb-1">Revenue Trend</h3>
        <p className="text-xs text-gray-500 mb-4">Monthly gross revenue (last 6 months)</p>
        <BarChart data={monthlyData} color="#ff5200" height={220} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Restaurant Payouts", value: formatCurrency(stats.gross * 0.82), icon: FaStore },
          { title: "Delivery Payouts", value: formatCurrency(stats.gross * 0.08), icon: FaMotorcycle },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-ui p-5 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-primary shrink-0">
              <s.icon className="text-2xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">{s.title}</p>
              <p className="text-xl font-extrabold">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}