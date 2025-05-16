import React from "react";
import { Edit3, Trash2 } from "lucide-react";

const MahasiswaTable = ({
  mahasiswas,
  isLoading,
  searchTerm,
  onEdit,
  onDelete,
}) => {
  // Filter mahasiswa berdasarkan pencarian
  const filteredMahasiswas = mahasiswas.filter(
    (mahasiswa) =>
      mahasiswa.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mahasiswa.name &&
        mahasiswa.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-100">
        <tr className="text-left">
          <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
            NIM
          </th>
          <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
            Nama
          </th>
          <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
            Status Voting
          </th>
          <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredMahasiswas.length > 0 ? (
          filteredMahasiswas.map((mahasiswa) => (
            <tr key={mahasiswa.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {mahasiswa.nim}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {mahasiswa.name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mahasiswa.hasVoted === true
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {mahasiswa.hasVoted === true
                    ? "Sudah Voting"
                    : "Belum Voting"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onEdit(mahasiswa)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={() => onDelete(mahasiswa.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
              {searchTerm
                ? "Tidak ada mahasiswa yang sesuai dengan pencarian"
                : "Belum ada data mahasiswa"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;
