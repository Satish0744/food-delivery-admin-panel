import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";

export default function CreateOffer() {
  const { addOffer } = useAdminData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "flat",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.code || !form.value || !form.minOrder) {
      showToast("Please fill required fields", "error");
      return;
    }
    addOffer({
      ...form,
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      maxDiscount: Number(form.maxDiscount || form.value),
      usageLimit: Number(form.usageLimit || 1000),
      used: 0,
      status: "active",
    });
    showToast("Offer created successfully!", "success");
    navigate("/admin/offers");
  };

  return (
    <div className="admin-container max-w-2xl space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1.5"
      >
        <FaArrowLeft /> Back
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-ui p-6">
        <h2 className="text-2xl font-extrabold mb-1">Create New Offer</h2>
        <p className="text-sm text-gray-500 mb-5">Set up a new coupon code for your customers</p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-ui">Coupon Code *</label>
              <input
                className="input-ui uppercase font-mono tracking-wider"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g., SAVE50"
              />
            </div>
            <div>
              <label className="label-ui">Type *</label>
              <select
                className="input-ui"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="flat">Flat Discount (₹)</option>
                <option value="percent">Percentage Discount (%)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label-ui">Description</label>
              <input
                className="input-ui"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., Flat ₹50 off on first order"
              />
            </div>
            <div>
              <label className="label-ui">Discount Value *</label>
              <input
                type="number"
                className="input-ui"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === "flat" ? "50" : "20"}
              />
            </div>
            <div>
              <label className="label-ui">Min Order (₹) *</label>
              <input
                type="number"
                className="input-ui"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                placeholder="200"
              />
            </div>
            <div>
              <label className="label-ui">Max Discount (₹)</label>
              <input
                type="number"
                className="input-ui"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                placeholder="100"
              />
            </div>
            <div>
              <label className="label-ui">Usage Limit</label>
              <input
                type="number"
                className="input-ui"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="1000"
              />
            </div>
            <div>
              <label className="label-ui">Start Date</label>
              <input
                type="date"
                className="input-ui"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label-ui">End Date</label>
              <input
                type="date"
                className="input-ui"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)} className="btn-outline text-sm">
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn-primary text-sm flex items-center gap-2"
            >
              <FaSave /> Create Offer
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}