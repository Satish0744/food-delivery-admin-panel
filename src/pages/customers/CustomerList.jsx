import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaBan, FaCheck, FaShoppingBag, FaRupeeSign } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function CustomerList() {
  const { customers, toggleCustomerBlock } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = [...customers];
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [customers, search, filter]);

  return (
    <div className="admin-container space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Customers</h2>
          <p className="text-sm text-gray-500">Manage all registered customers</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Customers", value: customers.length, icon: FaShoppingBag, color: "from-blue-400 to-blue-600" },
          { label: "Active", value: customers.filter(c => c.status === "active").length, icon: FaCheck, color: "from-emerald-400 to-emerald-600" },
          { label: "Blocked", value: customers.filter(c => c.status === "blocked").length, icon: FaBan, color: "from-red-400 to-red-600" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white flex items-center gap-3`}
          >
            <s.icon className="text-2xl opacity-80" />
            <div>
              <p className="text-xs opacity-90 uppercase">{s.label}</p>
              <p className="text-2xl font-extrabold">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "active", "blocked"].map((f) => (
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
        <div className="card-ui"><EmptyState icon="👥" title="No customers found" /></div>
      ) : (
        <div className="card-ui overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Orders</th>
                  <th className="table-header">Spent</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Joined</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-orange-50/40 cursor-pointer"
                    onClick={() => navigate(`/admin/customers/${c.id}`)}
                  >
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {c.name[0]}
                        </div>
                        <span className="font-semibold">{c.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <p className="text-xs">{c.email}</p>
                      <p className="text-xs text-gray-500">{c.phone}</p>
                    </td>
                    <td className="table-cell font-bold">{c.totalOrders}</td>
                    <td className="table-cell font-bold">{formatCurrency(c.totalSpent)}</td>
                    <td className="table-cell">
                      <Badge variant={c.status === "active" ? "success" : "danger"}>{c.status}</Badge>
                    </td>
                    <td className="table-cell text-xs">{formatDate(c.joinedAt)}</td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/customers/${c.id}`);
                          }}
                          className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          <FaEye className="text-xs" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCustomerBlock(c.id);
                            showToast(
                              c.status === "active" ? "Customer blocked" : "Customer unblocked",
                              "info"
                            );
                          }}
                          className={`p-1.5 rounded-lg ${
                            c.status === "active"
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          }`}
                        >
                          {c.status === "active" ? <FaBan className="text-xs" /> : <FaCheck className="text-xs" />}
                        </motion.button>
                      </div>
                    </td>
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