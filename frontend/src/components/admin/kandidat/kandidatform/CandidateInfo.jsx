import React from "react";

const CandidateInfo = ({ formData, onChange }) => {
  return (
    <div className="p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 bg-white">
      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
        Informasi Kandidat
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Nama Ketua
          </label>
          <input
            type="text"
            name="nameKetua"
            value={formData.nameKetua}
            onChange={onChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            placeholder="Masukkan nama ketua"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Nama Wakil
          </label>
          <input
            type="text"
            name="nameWakil"
            value={formData.nameWakil}
            onChange={onChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            placeholder="Masukkan nama wakil"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateInfo;
