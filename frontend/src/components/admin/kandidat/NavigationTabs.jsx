import React from "react";
import { List, Plus } from "lucide-react";

const NavigationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "daftar",
      label: "Daftar Kandidat",
      icon: <List className="w-4 h-4 mr-2" />,
    },
    {
      id: "tambah",
      label: "Tambah Kandidat",
      icon: <Plus className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="flex relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 sm:px-6 py-3 sm:py-4 font-medium flex items-center text-sm sm:text-base
              relative transition-all duration-300 ease-in-out
              ${
                activeTab === tab.id
                  ? "text-blue-700 bg-white shadow-sm"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
              }
            `}
          >
            <div
              className={`
              flex items-center transition-transform duration-200
              ${activeTab === tab.id ? "transform scale-105" : ""}
            `}
            >
              <div
                className={`
                transition-colors duration-200
                ${activeTab === tab.id ? "text-blue-600" : ""}
              `}
              >
                {tab.icon}
              </div>
              {tab.label}
            </div>

            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
