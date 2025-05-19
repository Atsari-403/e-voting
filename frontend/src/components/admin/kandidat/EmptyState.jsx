import React from "react";
import { Users } from "lucide-react";

const EmptyState = ({ onAddNewCandidate }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <Users className="w-10 h-10 md:w-12 md:h-12 text-blue-400 mb-3" />
      <p className="text-gray-500 font-medium text-center">
        Belum ada kandidat terdaftar.
      </p>
      <button
        onClick={onAddNewCandidate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Tambah Kandidat Sekarang
      </button>
    </div>
  );
};

export default EmptyState;
