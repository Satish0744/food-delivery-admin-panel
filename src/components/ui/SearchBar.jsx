import { FaSearch } from "react-icons/fa";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
      />
    </div>
  );
}