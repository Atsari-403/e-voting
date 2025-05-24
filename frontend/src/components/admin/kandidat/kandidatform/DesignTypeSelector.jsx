import React from "react";
import { ChevronDown } from "lucide-react";

const DesignTypeSelector = ({ designType, onChange }) => {
  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Tipe Desain
      </label>
      <div className="relative">
        <select
          name="designType"
          value={designType}
          onChange={onChange}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 sm:py-3 px-3 sm:px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          required
        >
          <option value="combined">Pamflet Gabungan</option>
          <option value="separate">Foto Terpisah</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-1 text-xs sm:text-sm text-gray-500">
        {designType === "combined"
          ? "Upload satu pamflet gabungan dengan foto ketua dan wakil"
          : "Upload foto ketua dan wakil secara terpisah"}
      </p>
    </div>
  );
};

export default DesignTypeSelector;
