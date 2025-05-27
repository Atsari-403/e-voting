import React from 'react';

const LoadingSpinner = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-700 font-medium text-sm sm:text-base">
          Memuat data...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
