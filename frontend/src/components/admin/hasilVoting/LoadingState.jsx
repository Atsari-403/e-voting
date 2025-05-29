import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
        <span className="text-gray-700 font-medium">
          Memuat data hasil voting...
        </span>
      </div>
    </div>
  );
};

export default LoadingState;
