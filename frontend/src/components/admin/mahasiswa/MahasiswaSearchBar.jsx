import React from "react";
import { Search } from "lucide-react";

const MahasiswaSearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Cari NIM atau nama..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full md:w-64"
      />
      <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
    </div>
  );
};

export default MahasiswaSearchBar;
