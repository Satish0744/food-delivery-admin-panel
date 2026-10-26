import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { formatCurrency } from "../../utils/helpers";

// Mock menu data — could be extended to load from context
const INITIAL_MENU = [
  { id: 1, name: "Paneer Butter Masala", category: "Main Course", price: 280, type: "veg", available: true },
  { id: 2, name: "Butter Naan", category: "Breads", price: 60, type: "veg", available: true },
  { id: 3, name: "Dal Makhani", category: "Main Course", price: 220, type: "veg", available: true },
  { id: 4, name: "Butter Chicken", category: "Main Course", price: 350, type: "non-veg", available: false },
];

export default function MenuManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants } = useAdminData();
  const { showToast } = useToast();
  const restaurant = restaurants.find((r) => r.id === id);

  const [menu, setMenu] = useState(INITIAL_MENU);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Main Course", price: "", type: "veg" });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: "Main Course", price: "", type: "veg" });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      showToast("Please fill all fields", "error");
      return;
    }
    if (editing) {
      setMenu((prev) =>
        prev.map((m) => (m.id === editing.id ? { ...m, ...form, price: Number(form.price) } : m))
      );
      showToast("Item updated", "success");
    } else {
      setMenu((prev) => [...prev, { ...form, price: Number(form.price), id: Date.now(), available: true }]);
      showToast("Item added", "success");
    }
    setModalOpen(false);
  };

  const handleDelete = (itemId) => {
    setMenu((prev) => prev.filter((m) => m.id !== itemId));
    showToast("Item deleted", "info");
  };

  const toggleAvail = (itemId) => {
    setMenu((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, available: !m.available } : m))
    );
    showToast("Availability toggled", "info");
  };

  return (
    <div className="admin-container space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1.5"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Menu — {restaurant?.name || id}</h2>
          <p className="text-sm text-gray-500">Manage menu items, prices, and availability</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <FaPlus /> Add Item
        </motion.button>
      </div>

      <div className="card-ui overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="table-header">Item</th>
                <th className="table-header">Category</th>
                <th className="table-header">Type</th>
                <th className="table-header">Price</th>
                <th className="table-header">Available</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-orange-50/40"
                >
                  <td className="table-cell font-semibold">{item.name}</td>
                  <td className="table-cell">{item.category}</td>
                  <td className="table-cell">
                    <Badge variant={item.type === "veg" ? "success" : "danger"}>
                      {item.type}
                    </Badge>
                  </td>
                  <td className="table-cell font-bold">{formatCurrency(item.price)}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => toggleAvail(item.id)}
                      className={`transition ${
                        item.available ? "text-emerald-600" : "text-gray-400"
                      } hover:scale-110`}
                    >
                      {item.available ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                    </button>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <FaEdit className="text-xs" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <FaTrash className="text-xs" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Item" : "Add Menu Item"}
        size="md"
      >
        <div className="space-y-3">
          <div>
            <label className="label-ui">Name</label>
            <input
              className="input-ui"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Paneer Tikka"
            />
          </div>
          <div>
            <label className="label-ui">Category</label>
            <select
              className="input-ui"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {["Main Course", "Starters", "Breads", "Rice", "Desserts", "Beverages"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-ui">Price (₹)</label>
              <input
                type="number"
                className="input-ui"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="label-ui">Type</label>
              <select
                className="input-ui"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-outline text-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary text-sm">
              {editing ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}