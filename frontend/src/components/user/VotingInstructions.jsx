import React from 'react';
import { Info } from 'lucide-react';

const VotingInstructions = () => {
  return (
    <div className="mt-6 sm:mt-10 bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full transform translate-x-10 sm:translate-x-20 -translate-y-10 sm:-translate-y-20"></div>
      <div className="absolute bottom-0 left-0 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 rounded-full transform -translate-x-10 sm:-translate-x-20 translate-y-10 sm:translate-y-20"></div>

      <div className="flex items-center mb-4 sm:mb-6 relative z-10">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 shadow-md">
          <Info className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text">
          Petunjuk Voting
        </h3>
      </div>

      <div className="pl-4 sm:pl-6 relative z-10">
        <ul className="space-y-2 sm:space-y-4">
          <li className="flex items-start text-gray-700">
            <div className="bg-blue-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
              <span className="text-blue-600 text-xs font-bold">1</span>
            </div>
            <span className="text-gray-600 text-xs sm:text-sm">
              Pilih salah satu kandidat dengan mengklik kartu atau tombol
              "Pilih Kandidat"
            </span>
          </li>
          <li className="flex items-start text-gray-700">
            <div className="bg-indigo-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
              <span className="text-indigo-600 text-xs font-bold">2</span>
            </div>
            <span className="text-gray-600 text-xs sm:text-sm">
              Konfirmasi pilihan Anda pada jendela yang muncul
            </span>
          </li>
          <li className="flex items-start text-gray-700">
            <div className="bg-purple-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
              <span className="text-purple-600 text-xs font-bold">3</span>
            </div>
            <span className="text-gray-600 text-xs sm:text-sm">
              Setelah konfirmasi, pilihan Anda tidak dapat diubah
            </span>
          </li>
          <li className="flex items-start text-gray-700">
            <div className="bg-pink-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
              <span className="text-pink-600 text-xs font-bold">4</span>
            </div>
            <span className="text-gray-600 text-xs sm:text-sm">
              Waktu voting dibatasi 15 menit. Jika waktu habis, Anda tidak
              bisa memilih kandidat
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VotingInstructions;
