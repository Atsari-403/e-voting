import React from "react";
import { Activity } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <div className="text-2xl font-medium text-gray-700 mb-3">
          Tidak ada data kandidat tersedia
        </div>
        <p className="text-gray-500 text-lg">
          Silakan tambahkan kandidat terlebih dahulu
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
