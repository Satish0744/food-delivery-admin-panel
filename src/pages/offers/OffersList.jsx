import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function OffersList() {
  const { offers, toggleOffer, deleteOffer } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(null);

  const handleDelete = () => {
    deleteOffer(confirm);
    showToast("Offer deleted", "info");
    setConfirm(null);
  };

  return (
    <div className="admin-container space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Offers & Promotions</h2>
          <p className="text-sm text-gray-500">Manage coupons and discount campaigns</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/admin/offers/create")}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <FaPlus /> Create Offer
        </motion.button>
      </div>

      {offers.length === 0 ? (
        <div className="card-ui"><EmptyState icon="🏷️" title="No offers yet" message="Create your first coupon code." /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {offers.map((o) => (
              <motion.div
                key={o.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -4 }}
                className="card-ui p-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  {o.type === "flat" ? `₹${o.value} OFF` : `${o.value}% OFF`}
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-lg tracking-wider">{o.code}</span>
                    <Badge
                      variant={
                        o.status === "active" ? "success" : o.status === "expired" ? "danger" : "warning"
                      }
                    >
                      {o.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{o.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Min Order</p>
                    <p className="font-bold">{formatCurrency(o.minOrder)}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Used</p>
                    <p className="font-bold">{o.used}/{o.usageLimit}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((o.used / o.usageLimit) * 100, 100)}%` }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Expires {formatDate(o.endDate)}
                  </p>
                </div>

                <div className="flex gap-1.5 pt-2 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleOffer(o.id);
                      showToast("Offer status toggled", "info");
                    }}
                    className="flex-1 bg-orange-50 text-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                  >
                    {o.status === "active" ? <><FaToggleOn /> Pause</> : <><FaToggleOff /> Activate</>}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirm(o.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <FaTrash className="text-xs" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Offer"
        message="Are you sure you want to delete this offer? This cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
}