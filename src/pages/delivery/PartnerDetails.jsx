import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaStar, FaPhone, FaEnvelope, FaMotorcycle, FaRupeeSign } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function PartnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { partners, orders } = useAdminData();
  const p = partners.find((x) => x.id === id);

  if (!p)
    return (
      <div className="admin-container">
        <button onClick={() => navigate(-1)} className="btn-outline mb-4 text-sm">
          <FaArrowLeft className="inline mr-1" /> Back
        </button>
        <div className="card-ui p-8 text-center">
          <p className="text-5xl mb-3">❌</p>
          <p className="text-lg font-bold">Partner not found</p>
        </div>
      </div>
    );

  const deliveredOrders = orders.filter((o) => o.partner === p.name && o.status === "delivered");

  return (
    <div className="admin-container max-w-5xl space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1.5"
      >
        <FaArrowLeft /> Back to Partners
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-ui p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-3xl">
            {p.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-extrabold">{p.name}</h2>
              <Badge variant={p.online ? "success" : "default"}>{p.online ? "Online" : "Offline"}</Badge>
              {p.verified ? <Badge variant="info">✓ Verified</Badge> : <Badge variant="warning">Unverified</Badge>}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1"><FaPhone /> {p.phone}</span>
              <span className="flex items-center gap-1"><FaEnvelope /> {p.email}</span>
              <span className="flex items-center gap-1"><FaMotorcycle /> {p.vehicle} · {p.vehicleNumber}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Rating", value: p.rating || "—", icon: FaStar, color: "text-yellow-500" },
          { label: "Deliveries", value: p.totalDeliveries, icon: FaMotorcycle, color: "text-blue-500" },
          { label: "Earnings", value: formatCurrency(p.earnings), icon: FaRupeeSign, color: "text-emerald-500" },
          { label: "Joined", value: formatDate(p.joinedAt), color: "text-primary" },
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
            <p className="text-lg font-extrabold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-ui p-5">
        <h3 className="font-bold mb-3">Recent Deliveries</h3>
        {deliveredOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No deliveries yet.</p>
        ) : (
          <div className="space-y-2">
            {deliveredOrders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-gray-500">{o.customer.name}</p>
                </div>
                <p className="font-bold text-sm">{formatCurrency(o.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}