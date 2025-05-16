import React, { useState } from "react";

const EditMahasiswaForm = ({ mahasiswa, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: mahasiswa.id,
    nim: mahasiswa.nim,
    name: mahasiswa.name || "",
    password: "",
  });

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
          placeholder="Kosongkan jika tidak ingin mengganti"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border bg-red-500 rounded-lg text-white hover:text-white hover:bg-red-600 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default EditMahasiswaForm;
