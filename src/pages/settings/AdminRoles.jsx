import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaUserShield, FaTrash } from "react-icons/fa";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const INITIAL_ADMINS = [
  { id: 1, name: "Admin", email: "admin@foodhub.com", role: "superadmin", active: true },
  { id: 2, name: "Priya Sharma", email: "priya@foodhub.com", role: "operations", active: true },
  { id: 3, name: "Rahul Verma", email: "rahul@foodhub.com", role: "support", active: true },
  { id: 4, name: "Ananya Iyer", email: "ananya@foodhub.com", role: "finance", active: false },
];

const ROLES = ["superadmin", "operations", "finance", "support", "delivery"];

export default function AdminRoles() {
  const { showToast } = useToast();
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "support" });

  const handleAdd = () => {
    if (!form.name || !form.email) {
      showToast("Fill all fields", "error");
      return;
    }
    setAdmins((prev) => [...prev, { ...form, id: Date.now(), active: true }]);
    showToast("Admin added", "success");
    setModal(false);
    setForm({ name: "", email: "", role: "support" });
  };

  return (
    <div className="admin-container space-y-4 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold">Admin Roles</h2>
          <p className="text-sm text-gray-500">Manage admin users and permissions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModal(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <FaPlus /> Add Admin
        </motion.button>
      </div>

      <div className="card-ui divide-y divide-gray-100">
        {admins.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {a.name[0]}
              </div>
              <div>
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-gray-500">{a.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={a.role === "superadmin" ? "primary" : "info"}>{a.role}</Badge>
              <Badge variant={a.active ? "success" : "default"}>{a.active ? "Active" : "Inactive"}</Badge>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Admin User">
        <div className="space-y-3">
          <div>
            <label className="label-ui">Name</label>
            <input className="input-ui" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-ui">Email</label>
            <input type="email" className="input-ui" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label-ui">Role</label>
            <select className="input-ui" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setModal(false)} className="btn-outline text-sm">Cancel</button>
            <button onClick={handleAdd} className="btn-primary text-sm">Add Admin</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}