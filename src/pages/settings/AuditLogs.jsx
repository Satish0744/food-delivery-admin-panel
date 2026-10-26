import { motion } from "framer-motion";
import { FaHistory } from "react-icons/fa";
import { useAdminData } from "../../context/AdminDataContext";
import EmptyState from "../../components/ui/EmptyState";
import { formatDateTime, timeAgo } from "../../utils/helpers";

export default function AuditLogs() {
  const { activityLog } = useAdminData();

  return (
    <div className="admin-container max-w-3xl space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold">Audit Logs</h2>
        <p className="text-sm text-gray-500">Track all admin actions on the platform</p>
      </div>

      <div className="card-ui p-5">
        {activityLog.length === 0 ? (
          <EmptyState icon="📜" title="No activity yet" message="Admin actions will appear here as they happen." />
        ) : (
          <div className="space-y-2">
            {activityLog.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-primary shrink-0">
                  <FaHistory className="text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(log.at)} · {timeAgo(log.at)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}