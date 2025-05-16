import React from "react";
import { Plus, Upload } from "lucide-react";

const MahasiswaActionButtons = ({ onAddClick, fileInputRef }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onAddClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Plus size={16} /> Tambah Mahasiswa
      </button>

      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Upload size={16} /> Upload Excel
      </button>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={(e) => fileInputRef.current.onFileChange(e)}
        className="hidden"
      />
    </div>
  );
};

export default MahasiswaActionButtons;
