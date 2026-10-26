import { useState } from "react";
import { motion } from "framer-motion";
import { FaSave } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

export default function PlatformSettings() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    platformName: "FoodHub",
    supportEmail: "support@foodhub.com",
    supportPhone: "+91 80 1234 5678",
    commissionRate: 18,
    deliveryFee: 40,
    taxRate: 5,
    minOrder: 100,
    freeDeliveryAbove: 500,
    maintenanceMode: false,
    allowRegistration: true,
  });

  const handleSave = () => {
    showToast("Settings saved successfully!", "success");
  };

  return (
    <div className="admin-container max-w-3xl space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold">Platform Settings</h2>
        <p className="text-sm text-gray-500">Configure global platform settings</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-ui p-6 space-y-5">
        <div>
          <h3 className="font-bold text-sm mb-3 text-primary uppercase tracking-wide">General</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-ui">Platform Name</label>
              <input className="input-ui" value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} />
            </div>
            <div>
              <label className="label-ui">Support Email</label>
              <input className="input-ui" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
            </div>
            <div>
              <label className="label-ui">Support Phone</label>
              <input className="input-ui" value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-bold text-sm mb-3 text-primary uppercase tracking-wide">Pricing</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "commissionRate", label: "Commission Rate (%)" },
              { key: "deliveryFee", label: "Delivery Fee (₹)" },
              { key: "taxRate", label: "Tax Rate (%)" },
              { key: "minOrder", label: "Min Order Value (₹)" },
              { key: "freeDeliveryAbove", label: "Free Delivery Above (₹)" },
            ].map((f) => (
              <div key={f.key}>
                <label className="label-ui">{f.label}</label>
                <input
                  type="number"
                  className="input-ui"
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-bold text-sm mb-3 text-primary uppercase tracking-wide">Features</h3>
          <div className="space-y-2">
            {[
              { key: "maintenanceMode", label: "Maintenance Mode", desc: "Hide the platform from customers" },
              { key: "allowRegistration", label: "Allow New Registrations", desc: "New restaurants & partners can sign up" },
            ].map((f) => (
              <label key={f.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-sm">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                  className="w-5 h-5 accent-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          <FaSave /> Save Settings
        </motion.button>
      </motion.div>
    </div>
  );
}