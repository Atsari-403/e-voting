import React from "react";
import { Clock } from "lucide-react";

const Header = ({ lastUpdated }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-2">
        <Clock className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-600">
          Terakhir update: {new Date(lastUpdated).toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
};

export default Header;
