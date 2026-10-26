import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingBag, FaRupeeSign } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, orders } = useAdminData();
  const c = customers.find((x) => x.id === id);

  if (!c)
    return (
      <div className="admin-container">
        <button onClick={() => navigate(-1)} className="btn-outline mb-4 text-sm">
          <FaArrowLeft className="inline mr-1" /> Back
        </button>
        <div className="card-ui p-8 text-center">
          <p className="text-5xl mb-3">❌</p>
          <p className="text-lg font-bold">Customer not found</p>
        </div>
      </div>
    );

  const customerOrders = orders.filter((o) => o.customer.name === c.name);

  return (
    <div className="admin-container max-w-4xl space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1.5"
      >
        <FaArrowLeft /> Back to Customers
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-ui p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-3xl shrink-0">
            {c.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h2 className="text-2xl font-extrabold">{c.name}</h2>
              <Badge variant={c.status === "active" ? "success" : "danger"}>{c.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2 justify-center sm:justify-start">
              <span className="flex items-center gap-1"><FaEnvelope /> {c.email}</span>
              <span className="flex items-center gap-1"><FaPhone /> {c.phone}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Orders", value: c.totalOrders, icon: FaShoppingBag, color: "text-blue-500" },
          { label: "Total Spent", value: formatCurrency(c.totalSpent), icon: FaRupeeSign, color: "text-emerald-500" },
          { label: "Joined", value: formatDate(c.joinedAt) },
          { label: "Last Order", value: formatDate(c.lastOrder) },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-ui p-4 text-center"
          >
            {s.icon && <s.icon className={`text-xl mx-auto mb-1 ${s.color}`} />}
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="font-extrabold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-ui p-4">
        <div className="flex items-center gap-2 text-primary mb-2">
          <FaMapMarkerAlt /> <span className="font-bold text-sm">Address</span>
        </div>
        <p className="text-sm text-gray-700">{c.address}</p>
      </div>

      <div className="card-ui p-5">
        <h3 className="font-bold mb-3">Order History</h3>
        {customerOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-2">
            {customerOrders.map((o) => (
              <motion.div
                key={o.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate(`/admin/orders/${o.id}`)}
                className="flex justify-between items-center p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-orange-50"
              >
                <div>
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-gray-500">{o.restaurant}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatCurrency(o.amount)}</p>
                  <Badge variant={o.status === "delivered" ? "success" : "primary"}>{o.status}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}