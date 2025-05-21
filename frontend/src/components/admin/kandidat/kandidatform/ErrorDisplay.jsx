import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded shadow-sm">
      <div className="flex">
        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
        <span className="text-sm sm:text-base">{error}</span>
      </div>
    </div>
  );
};

export default ErrorDisplay;
