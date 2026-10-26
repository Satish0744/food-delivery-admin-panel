import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaRupeeSign, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

export default function Transactions() {
  const { transactions } = useAdminData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filter !== "all") list = list.filter((t) => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [transactions, search, filter]);

  const stats = useMemo(() => {
    return {
      total: transactions.reduce((s, t) => s + (t.status === "success" ? t.amount : 0), 0),
      success: transactions.filter((t) => t.status === "success").length,
      failed: transactions.filter((t) => t.status === "failed").length,
      pending: transactions.filter((t) => t.status === "pending").length,
      commission: transactions.reduce((s, t) => s + (t.commission || 0), 0),
    };
  }, [transactions]);

  return (
    <div className="admin-container space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Transactions</h2>
          <p className="text-sm text-gray-500">All payment transactions on the platform</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search transactions..." />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Revenue", value: formatCurrency(stats.total), color: "text-emerald-600", icon: FaRupeeSign },
          { label: "Success", value: stats.success, color: "text-emerald-600", icon: FaCheckCircle },
          { label: "Pending", value: stats.pending, color: "text-amber-600", icon: FaClock },
          { label: "Failed", value: stats.failed, color: "text-red-600", icon: FaTimesCircle },
          { label: "Commission", value: formatCurrency(stats.commission), color: "text-primary", icon: FaRupeeSign },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-ui p-4"
          >
            <s.icon className={`text-xl mb-1 ${s.color}`} />
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`font-extrabold text-lg ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "success", "pending", "failed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              filter === f ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card-ui"><EmptyState icon="💳" title="No transactions found" /></div>
      ) : (
        <div className="card-ui overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="table-header">TXN ID</th>
                  <th className="table-header">Order</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Restaurant</th>
                  <th className="table-header">Method</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Commission</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-orange-50/40"
                  >
                    <td className="table-cell font-bold">{t.id}</td>
                    <td className="table-cell">{t.orderId}</td>
                    <td className="table-cell">{t.customer}</td>
                    <td className="table-cell">{t.restaurant}</td>
                    <td className="table-cell">{t.method}</td>
                    <td className="table-cell font-bold">{formatCurrency(t.amount)}</td>
                    <td className="table-cell text-primary font-semibold">{formatCurrency(t.commission)}</td>
                    <td className="table-cell">
                      <Badge
                        variant={t.status === "success" ? "success" : t.status === "failed" ? "danger" : "warning"}
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="table-cell text-xs">{formatDateTime(t.date)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}