import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const AddMahasiswaForm = ({ onClose, onSubmit, isSaving }) => {
  const [formData, setFormData] = useState({ nim: "", name: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          NIM
        </label>
        <input
          type="text"
          name="nim"
          placeholder="Masukkan NIM"
          value={formData.nim}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama
        </label>
        <input
          type="text"
          name="name"
          placeholder="Masukkan Nama"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Masukkan Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 rounded-lg text-white hover:text-white hover:bg-red-600 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5 inline" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddMahasiswaForm;
