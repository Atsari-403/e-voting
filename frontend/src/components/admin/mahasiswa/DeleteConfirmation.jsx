import React from "react";

const DeleteConfirmation = ({ onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete();
      onClose();
    } catch (error) {
      if (error.response?.data?.reason === "USER_ALREADY_VOTED") {
        alert("Tidak dapat menghapus mahasiswa yang sudah voting");
        return;
      }
      console.error("Error deleting user:", error);
      alert("Gagal menghapus pengguna");
    }
  };

  return (
    <div>
      <p className="mb-4 text-gray-700">
        Apakah Anda yakin ingin menghapus user ini?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
