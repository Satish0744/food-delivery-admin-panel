import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants } = useAdminData();
  const r = restaurants.find((x) => x.id === id);

  if (!r)
    return (
      <div className="admin-container">
        <button onClick={() => navigate(-1)} className="btn-outline mb-4 text-sm">
          <FaArrowLeft className="inline mr-1" /> Back
        </button>
        <div className="card-ui p-8 text-center">
          <p className="text-5xl mb-3">❌</p>
          <p className="text-lg font-bold">Restaurant not found</p>
        </div>
      </div>
    );

  return (
    <div className="admin-container max-w-5xl space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1.5"
      >
        <FaArrowLeft /> Back to Restaurants
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-ui p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-3xl shrink-0">
            {r.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-extrabold">{r.name}</h2>
              <Badge variant={r.status === "active" ? "success" : "warning"}>
                {r.status}
              </Badge>
              {r.verified && <Badge variant="info">✓ Verified</Badge>}
            </div>
            <p className="text-sm text-gray-600 mt-1">{r.cuisine} · Owner: {r.owner}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><FaPhone /> {r.phone}</span>
              <span className="flex items-center gap-1"><FaEnvelope /> {r.email}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Rating", value: r.rating, icon: FaStar, color: "text-yellow-500" },
          { label: "Total Orders", value: r.totalOrders, color: "text-blue-500" },
          { label: "Revenue", value: formatCurrency(r.revenue), color: "text-emerald-500" },
          { label: "Commission", value: `${r.commission}%`, color: "text-primary" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-ui p-4 text-center"
          >
            <s.icon className={`text-xl mx-auto mb-1 ${s.color}`} />
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="text-lg font-extrabold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="card-ui p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <FaMapMarkerAlt /> <span className="font-bold text-sm">Address</span>
          </div>
          <p className="text-sm text-gray-700">{r.address}</p>
        </div>
        <div className="card-ui p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <FaClock /> <span className="font-bold text-sm">Operating Hours</span>
          </div>
          <p className="text-sm text-gray-700">{r.openHours}</p>
        </div>
      </div>

      <div className="card-ui p-4">
        <p className="text-xs text-gray-500">
          Registered on {formatDate(r.registeredAt)}
        </p>
      </div>
    </div>
  );
}