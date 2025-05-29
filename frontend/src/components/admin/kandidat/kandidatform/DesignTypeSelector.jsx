import React from "react";
import { ChevronDown, Layout } from "lucide-react";

const DesignTypeSelector = ({ designType, onChange }) => {
  return (
    <div className="p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Layout className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Tipe Desain</h3>
          <p className="text-sm text-gray-600">
            Pilih format upload foto kandidat
          </p>
        </div>
      </div>

      <div className="relative">
        <select
          name="designType"
          value={designType}
          onChange={onChange}
          className="block appearance-none w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-base font-medium shadow-sm hover:border-blue-300 transition-all duration-300"
          required
        >
          <option value="combined">Pamflet Gabungan</option>
          <option value="separate">Foto Terpisah</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>

      {/* <div className="mt-4 p-4 bg-blue-100 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-700">
          {designType === "combined"
            ? "Upload satu pamflet gabungan dengan foto ketua dan wakil"
            : "Upload foto ketua dan wakil secara terpisah"}
        </p>
      </div> */}
    </div>
  );
};

export default DesignTypeSelector;
