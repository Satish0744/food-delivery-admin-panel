import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
      >
        <FaChevronLeft className="text-xs" />
      </button>
      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
}