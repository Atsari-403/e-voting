import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-xl flex flex-col items-center">
        <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-700 font-medium text-sm sm:text-base">
          Memuat data...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
