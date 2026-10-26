import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaCheck, FaTimes, FaTruck } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

const TABS = [
  { id: "all", label: "All Orders" },
  { id: "placed", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "preparing", label: "Preparing" },
  { id: "out-for-delivery", label: "Active Delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const statusVariant = {
  placed: "warning",
  confirmed: "info",
  preparing: "primary",
  "out-for-delivery": "info",
  delivered: "success",
  cancelled: "danger",
};

export default function AllOrders() {
  const { orders, updateOrderStatus } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...orders];
    if (tab !== "all") list = list.filter((o) => o.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.restaurant.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, tab, search]);

  const handleAction = (id, action) => {
    const statusMap = {
      confirm: "confirmed",
      prepare: "preparing",
      dispatch: "out-for-delivery",
      deliver: "delivered",
      cancel: "cancelled",
    };
    updateOrderStatus(id, statusMap[action]);
    showToast(`Order ${id} → ${statusMap[action]}`, "success");
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (v) => <span className="font-bold text-gray-900">{v}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (c) => (
        <div>
          <p className="font-semibold">{c.name}</p>
          <p className="text-xs text-gray-500">{c.phone}</p>
        </div>
      ),
    },
    { key: "restaurant", label: "Restaurant" },
    {
      key: "amount",
      label: "Amount",
      render: (v) => <span className="font-bold">{formatCurrency(v)}</span>,
    },
    { key: "paymentMethod", label: "Payment" },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <Badge variant={statusVariant[v]}>{v.replace("-", " ")}</Badge>
      ),
    },
    {
      key: "placedAt",
      label: "Placed",
      render: (v) => <span className="text-xs">{formatDateTime(v)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/orders/${row.id}`);
            }}
            className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="View"
          >
            <FaEye className="text-xs" />
          </motion.button>
          {row.status === "placed" && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, "confirm");
              }}
              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              title="Confirm"
            >
              <FaCheck className="text-xs" />
            </motion.button>
          )}
          {row.status === "confirmed" && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, "prepare");
              }}
              className="p-1.5 rounded-lg bg-orange-100 text-primary hover:bg-orange-200"
              title="Start Preparing"
            >
              <FaTruck className="text-xs" />
            </motion.button>
          )}
          {["placed", "confirmed"].includes(row.status) && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, "cancel");
              }}
              className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
              title="Cancel"
            >
              <FaTimes className="text-xs" />
            </motion.button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="admin-container space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Order Management</h2>
          <p className="text-sm text-gray-500">
            Manage all customer orders across the platform
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by ID, customer, or restaurant..."
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tab === t.id
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
            }`}
          >
            {t.label}
            <span className="ml-1.5 opacity-70">
              ({t.id === "all" ? orders.length : orders.filter((o) => o.status === t.id).length})
            </span>
          </button>
        ))}
      </div>

      <div className="card-ui overflow-hidden">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <EmptyState icon="📦" title="No orders found" message="Try a different filter." />
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              onRowClick={(row) => navigate(`/admin/orders/${row.id}`)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}