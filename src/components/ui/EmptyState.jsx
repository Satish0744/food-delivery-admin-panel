import { motion } from "framer-motion";

export default function EmptyState({ icon = "📭", title = "No data", message = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <p className="text-6xl mb-4">{icon}</p>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {message && <p className="text-sm text-gray-500 mt-1">{message}</p>}
    </motion.div>
  );
}