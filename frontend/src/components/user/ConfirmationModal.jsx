import React from 'react';
import { X, Award } from 'lucide-react';

const ConfirmationModal = ({
  show,
  candidate,
  candidates,
  onClose,
  onConfirm,
}) => {
  if (!show || !candidate) {
    return null;
  }

  const candidateIndex = candidates.findIndex((c) => c.id === candidate.id);
  const pairNumber = candidateIndex !== -1 ? candidateIndex + 1 : '?'; // Handle if not found

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full transform translate-x-10 sm:translate-x-16 -translate-y-10 sm:-translate-y-16"></div>

        <div className="flex justify-between items-center mb-4 sm:mb-5 relative z-10">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Konfirmasi Pilihan
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="relative z-10">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 border border-gray-100">
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              Anda akan memilih:
            </p>
            <div className="font-medium text-gray-800 flex items-center">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
              <span>
                Pasangan No {pairNumber} - {candidate.nameKetua} &{' '}
                {candidate.nameWakil}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Pilihan tidak dapat diubah setelah konfirmasi. Pastikan pilihan
            Anda sudah benar.
          </p>

          <div className="flex space-x-3 sm:space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 sm:py-3 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium"
            >
              Kembali
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 sm:py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-colors text-xs sm:text-sm font-medium"
            >
              Konfirmasi Pilihan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
