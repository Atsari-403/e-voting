import React from "react";
import { Activity } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col items-center">
          <Activity className="h-12 w-12 text-gray-400 mb-4" />
          <div className="text-xl font-medium text-gray-700">
            Tidak ada data kandidat tersedia
          </div>
          <p className="text-gray-500 mt-2">
            Silakan tambahkan kandidat terlebih dahulu
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
