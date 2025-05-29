import React from "react";
import { FileText } from "lucide-react";

const VisionMission = ({ formData, onChange }) => {
  return (
    <div className="p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Visi & Misi</h3>
          <p className="text-sm text-gray-600">
            Jelaskan visi dan misi kandidat
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Visi
          </label>
          <textarea
            name="visi"
            value={formData.visi}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-base resize-none hover:border-blue-300 transition-all duration-300"
            rows="3"
            placeholder="Jelaskan visi kandidat"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Misi
          </label>
          <textarea
            name="misi"
            value={formData.misi}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-base resize-none hover:border-blue-300 transition-all duration-300"
            rows="4"
            placeholder="Jelaskan misi kandidat"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
