import React from "react";
import { Users } from "lucide-react";

const EmptyState = ({ onAddNewCandidate }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 mb-2 sm:mb-3" />
      <p className="text-gray-500 font-medium text-center text-sm sm:text-base">
        Belum ada kandidat terdaftar.
      </p>
      <button
        onClick={onAddNewCandidate}
        className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
      >
        Tambah Kandidat Sekarang
      </button>
    </div>
  );
};

export default EmptyState;
