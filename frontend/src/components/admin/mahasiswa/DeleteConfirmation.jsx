import React from "react";

const DeleteConfirmation = ({ onClose, onDelete }) => {
  return (
    <div>
      <p className="mb-4 text-gray-700">
        Apakah Anda yakin ingin menghapus mahasiswa ini?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
