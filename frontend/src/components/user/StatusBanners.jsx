import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const StatusBanners = ({ hasVoted, timeExpired }) => {
  return (
    <div className="mb-4 sm:mb-6">
      {/* Info Banner untuk User yang Sudah Memilih */}
      {hasVoted && (
        <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 mb-4 rounded-md shadow-sm animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-green-800">
                Terima kasih atas partisipasi Anda!
              </p>
              <p className="text-xs sm:text-sm text-green-700 mt-1">
                Anda sudah memberikan suara. Anda masih dapat melihat
                kandidat, namun tidak dapat memberikan suara lagi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner untuk Waktu Habis */}
      {timeExpired && !hasVoted && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 rounded-md shadow-sm animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-red-800">
                Waktu voting telah habis!
              </p>
              <p className="text-xs sm:text-sm text-red-700 mt-1">
                Anda tidak dapat memberikan suara lagi karena batas waktu
                sudah berakhir.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBanners;
