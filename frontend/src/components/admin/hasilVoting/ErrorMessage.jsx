import React from "react";
import { XCircle } from "lucide-react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
