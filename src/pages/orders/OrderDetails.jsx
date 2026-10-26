import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaStore,
  FaMotorcycle,
  FaRupeeSign,
} from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

const TIMELINE = [
  { key: "placed", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useAdminData();
  const order = orders.find((o) => o.id === id);

  if (!order)
    return (
      <div className="admin-container">
        <button onClick={() => navigate(-1)} className="btn-outline mb-4 text-sm">
          <FaArrowLeft className="inline mr-1" /> Back
        </button>
        <div className="card-ui p-8 text-center">
          <p className="text-5xl mb-3">❌</p>
          <p className="text-lg font-bold">Order not found</p>
        </div>
      </div>
    );

  const currentIndex = TIMELINE.findIndex((t) => t.key === order.status);

  return (
    <div className="admin-container max-w-5xl space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1.5"
      >
        <FaArrowLeft /> Back to Orders
      </button>

      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 card-ui p-5"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Order ID</p>
              <h2 className="text-2xl font-extrabold">{order.id}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {formatDateTime(order.placedAt)}
              </p>
            </div>
            <Badge
              variant={
                order.status === "delivered"
                  ? "success"
                  : order.status === "cancelled"
                  ? "danger"
                  : "primary"
              }
            >
              {order.status.replace("-", " ")}
            </Badge>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-bold text-sm mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 rounded-lg bg-gray-50"
                >
                  <span className="text-sm font-medium">
                    {item.qty}x {item.name}
                  </span>
                  <span className="text-sm font-bold">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
              <span className="font-bold">Total</span>
              <span className="text-xl font-extrabold text-primary">
                {formatCurrency(order.amount)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-ui p-5"
        >
          <h3 className="font-bold text-sm mb-3">Track Order</h3>
          <div className="space-y-3">
            {TIMELINE.map((step, idx) => {
              const isDone = idx <= currentIndex;
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isDone
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      isDone ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card-ui p-4">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <FaUser /> <span className="font-bold text-sm">Customer</span>
          </div>
          <p className="font-semibold">{order.customer.name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <FaPhone className="text-[10px]" /> {order.customer.phone}
          </p>
          <p className="text-xs text-gray-500 truncate">{order.customer.email}</p>
        </div>

        <div className="card-ui p-4">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <FaStore /> <span className="font-bold text-sm">Restaurant</span>
          </div>
          <p className="font-semibold">{order.restaurant}</p>
          <p className="text-xs text-gray-500 mt-1">Prepared fresh</p>
        </div>

        <div className="card-ui p-4">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <FaMotorcycle /> <span className="font-bold text-sm">Delivery Partner</span>
          </div>
          <p className="font-semibold">{order.partner || "Not assigned yet"}</p>
          {order.partner && <p className="text-xs text-gray-500 mt-1">Assigned</p>}
        </div>

        <div className="card-ui p-4 sm:col-span-2">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <FaMapMarkerAlt /> <span className="font-bold text-sm">Delivery Address</span>
          </div>
          <p className="text-sm text-gray-700">{order.address}</p>
        </div>

        <div className="card-ui p-4">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <FaRupeeSign /> <span className="font-bold text-sm">Payment</span>
          </div>
          <p className="font-semibold">{order.paymentMethod}</p>
          <p className="text-xs text-gray-500 mt-1">Status: {order.refundStatus || "Success"}</p>
        </div>
      </div>
    </div>
  );
}