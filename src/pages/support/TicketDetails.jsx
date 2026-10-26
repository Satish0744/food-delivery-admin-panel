import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaEnvelope, FaUser, FaClock } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/ui/Badge";
import { formatDateTime } from "../../utils/helpers";

const STATUSES = ["open", "in-progress", "resolved", "closed"];

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, updateTicketStatus } = useAdminData();
  const { showToast } = useToast();
  const t = tickets.find((x) => x.id === id);

  if (!t)
    return (
      <div className="admin-container">
        <button onClick={() => navigate(-1)} className="btn-outline mb-4 text-sm">
          <FaArrowLeft className="inline mr-1" /> Back
        </button>
        <div className="card-ui p-8 text-center">
          <p className="text-5xl mb-3">❌</p>
          <p className="text-lg font-bold">Ticket not found</p>
        </div>
      </div>
    );

  return (
    <div className="admin-container max-w-3xl space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1.5"
      >
        <FaArrowLeft /> Back to Tickets
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-ui p-6">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
          <div>
            <p className="text-xs text-gray-500 uppercase">Ticket ID</p>
            <h2 className="text-xl font-extrabold">{t.id}</h2>
          </div>
          <Badge variant={t.status === "open" ? "warning" : t.status === "resolved" ? "success" : "info"}>
            {t.status}
          </Badge>
        </div>

        <h3 className="font-bold text-lg mb-2">{t.subject}</h3>
        <p className="text-sm text-gray-700 mb-4">{t.message}</p>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FaUser className="text-primary" />
            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-semibold text-sm">{t.customer}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FaEnvelope className="text-primary" />
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-semibold text-sm truncate">{t.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <FaClock className="text-primary" />
            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-semibold text-sm">{formatDateTime(t.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <span className="text-primary font-bold">#{t.category}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-600 uppercase mb-2">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  updateTicketStatus(t.id, s);
                  showToast(`Ticket marked as ${s}`, "success");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  t.status === s
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.replace("-", " ").toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}