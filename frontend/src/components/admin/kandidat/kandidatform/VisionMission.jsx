import React from "react";

const VisionMission = ({ formData, onChange }) => {
  return (
    <div className="p-3 sm:p-4 bg-white rounded-lg mb-4 sm:mb-6">
      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
        Visi & Misi
      </h3>
      <div className="mb-3 sm:mb-4">
        <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
          Visi
        </label>
        <textarea
          name="visi"
          value={formData.visi}
          onChange={onChange}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          rows="3"
          placeholder="Jelaskan visi kandidat"
          required
        ></textarea>
      </div>

      <div>
        <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
          Misi
        </label>
        <textarea
          name="misi"
          value={formData.misi}
          onChange={onChange}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          rows="4"
          placeholder="Jelaskan misi kandidat"
          required
        ></textarea>
      </div>
    </div>
  );
};

export default VisionMission;
