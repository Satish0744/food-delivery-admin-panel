import { motion } from "framer-motion";

export default function DataTable({ columns, data, emptyMessage = "No records found", rowKey = "id", onRowClick }) {
  if (!data.length) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-header whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={row[rowKey]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-orange-50/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="table-cell whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}