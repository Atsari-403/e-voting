import React from 'react';
import { Check } from 'lucide-react';

const SuccessModal = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Voting Berhasil!
        </h3>
        <p className="text-gray-600 mb-4">
          Terima kasih atas partisipasi Anda dalam pemilihan ini.
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
