import React from 'react';
import { X } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md shadow-sm mb-4 sm:mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-xs sm:text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
