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
    <div className="bg-blue-50">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 sm:px-6 py-2 sm:py-3 font-medium flex items-center text-sm sm:text-base ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
