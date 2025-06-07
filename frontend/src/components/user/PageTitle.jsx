import React from 'react';
import { Clock } from 'lucide-react';

const PageTitle = ({ formattedTime, hasVoted, timeExpired }) => {
  return (
    <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full transform translate-x-16 -translate-y-16"></div>
      <div className="relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 w-1 h-6 sm:h-8 rounded mr-3"></span>
          Pemilihan Kandidat
        </h2>
        <p className="text-sm sm:text-base text-gray-600 ml-4">
          Silakan pilih kandidat yang ingin Anda dukung untuk masa depan
          yang lebih baik
        </p>

        {/* Countdown timer */}
        {!hasVoted && !timeExpired && (
          <div className="mt-3 sm:mt-4 ml-4 inline-flex items-center bg-blue-50 px-2 sm:px-3 py-1 rounded-full border border-blue-100">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-blue-700">
              Waktu tersisa: {formattedTime}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
