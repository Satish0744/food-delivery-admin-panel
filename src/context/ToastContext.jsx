import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const config = {
    success: { icon: FaCheckCircle, color: "text-success", border: "border-l-success" },
    error: { icon: FaExclamationCircle, color: "text-danger", border: "border-l-danger" },
    info: { icon: FaInfoCircle, color: "text-info", border: "border-l-info" },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-xs w-full">
        <AnimatePresence>
          {toasts.map((toast) => {
            const cfg = config[toast.type] || config.info;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={toast.id}
                initial={{ x: 300, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 300, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`bg-white rounded-lg shadow-lg border-l-4 ${cfg.border} p-3 flex items-center gap-3`}
              >
                <Icon className={`text-lg shrink-0 ${cfg.color}`} />
                <span className="text-sm font-medium text-gray-800 flex-1">
                  {toast.message}
                </span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-gray-700 shrink-0"
                >
                  <FaTimes className="text-xs" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};