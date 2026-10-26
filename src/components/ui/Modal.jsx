import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-slate-900 rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl transition-colors`}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 p-1"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 sm:p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}