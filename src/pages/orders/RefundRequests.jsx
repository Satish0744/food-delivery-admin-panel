import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

export default function RefundRequests() {
  const { orders, approveRefund, rejectRefund } = useAdminData();
  const { showToast } = useToast();

  const refunds = useMemo(
    () => orders.filter((o) => o.refundStatus && o.refundStatus !== "none"),
    [orders]
  );

  const handle = (id, action) => {
    if (action === "approve") {
      approveRefund(id);
      showToast(`Refund approved for ${id}`, "success");
    } else {
      rejectRefund(id);
      showToast(`Refund rejected for ${id}`, "error");
    }
  };

  return (
    <div className="admin-container space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold">Refund Requests</h2>
        <p className="text-sm text-gray-500">
          Review and process refund requests from customers
        </p>
      </div>

      {refunds.length === 0 ? (
        <div className="card-ui">
          <EmptyState icon="✅" title="No refund requests" message="All refunds are processed." />
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {refunds.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card-ui p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{order.id}</span>
                      <Badge
                        variant={
                          order.refundStatus === "pending"
                            ? "warning"
                            : order.refundStatus === "approved"
                            ? "success"
                            : "danger"
                        }
                      >
                        {order.refundStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {order.customer.name} · {order.restaurant}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDateTime(order.placedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Refund Amount</p>
                    <p className="text-lg font-extrabold text-primary">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>

                {order.refundStatus === "pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handle(order.id, "approve")}
                      className="btn-primary text-sm flex-1 flex items-center justify-center gap-1.5"
                    >
                      <FaCheck /> Approve Refund
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handle(order.id, "reject")}
                      className="btn-danger text-sm flex-1 flex items-center justify-center gap-1.5"
                    >
                      <FaTimes /> Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}