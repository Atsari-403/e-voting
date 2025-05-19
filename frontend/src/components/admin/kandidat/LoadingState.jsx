import React from "react";
import { RefreshCw } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center p-4 sm:p-6 md:p-12">
      <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-spin" />
      <p className="ml-3 font-medium text-gray-600">Memuat data kandidat...</p>
    </div>
  );
};

export default LoadingState;
