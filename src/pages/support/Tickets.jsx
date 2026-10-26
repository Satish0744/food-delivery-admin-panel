import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import { timeAgo } from "../../utils/helpers";

export default function Tickets() {
  const { tickets } = useAdminData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = [...tickets];
    if (filter !== "all") list = list.filter((t) => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tickets, search, filter]);

  const statusVariant = { open: "warning", "in-progress": "info", resolved: "success", closed: "default" };
  const priorityVariant = { high: "danger", medium: "warning", low: "info" };

  return (
    <div className="admin-container space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Support Tickets</h2>
          <p className="text-sm text-gray-500">Manage customer support requests</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tickets..." />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: tickets.length, color: "text-gray-900" },
          { label: "Open", value: tickets.filter(t => t.status === "open").length, color: "text-amber-600" },
          { label: "In Progress", value: tickets.filter(t => t.status === "in-progress").length, color: "text-blue-600" },
          { label: "Resolved", value: tickets.filter(t => t.status === "resolved").length, color: "text-emerald-600" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-ui p-4"
          >
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "open", "in-progress", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              filter === f ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card-ui"><EmptyState icon="🎫" title="No tickets found" /></div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.005 }}
              className="card-ui p-4 cursor-pointer"
              onClick={() => navigate(`/admin/support/tickets/${t.id}`)}
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm">{t.id}</span>
                    <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                    <Badge variant={priorityVariant[t.priority]}>⚠ {t.priority}</Badge>
                  </div>
                  <p className="font-semibold text-gray-900 truncate">{t.subject}</p>
                  <p className="text-xs text-gray-500 truncate">{t.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t.customer} · {timeAgo(t.createdAt)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 self-start"
                >
                  <FaEye className="text-xs" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}