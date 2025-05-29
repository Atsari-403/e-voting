import React, { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Loader2,
} from "lucide-react";

const MahasiswaTable = ({
  mahasiswas,
  isLoading,
  searchTerm,
  onEdit,
  onDelete,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState("nim");
  const [sortDirection, setSortDirection] = useState("asc");

  // Menangani pengurutan
  const handleSort = (field) => {
    // Jika field yang sama diklik, ubah arah pengurutan
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Jika field berbeda, atur field baru dan arah ke ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter dan urutkan mahasiswa
  const sortedAndFilteredMahasiswas = [...mahasiswas]
    .filter(
      (mahasiswa) =>
        mahasiswa.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mahasiswa.name &&
          mahasiswa.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Handle untuk kolom NIM
      if (sortField === "nim") {
        if (sortDirection === "asc") {
          return a.nim.localeCompare(b.nim, undefined, { numeric: true });
        } else {
          return b.nim.localeCompare(a.nim, undefined, { numeric: true });
        }
      }
      // Handle untuk kolom nama
      else if (sortField === "name") {
        // Handle jika nama null atau undefined
        const nameA = a.name || "";
        const nameB = b.name || "";

        if (sortDirection === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      }
      // Default
      return 0;
    });

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredMahasiswas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    sortedAndFilteredMahasiswas.length / itemsPerPage
  );

  // Reset to first page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  // Render sort icon based on current sort state
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="inline ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="inline ml-1 text-blue-600" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow relative">
      {/* Mobile scroll indicator */}
      <div className="md:hidden bg-blue-50 px-3 py-2 text-xs text-blue-600 border-b border-blue-100 flex items-center">
        <ArrowRight className="w-4 h-4 mr-1" />
        Geser untuk melihat semua data
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("nim")}
            >
              <div className="flex items-center">
                NIM
                {renderSortIcon("nim")}
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Nama
                {renderSortIcon("name")}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Status Voting
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.length > 0 ? (
            currentItems.map((mahasiswa) => (
              <tr
                key={mahasiswa.id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {mahasiswa.nim}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {mahasiswa.name || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      mahasiswa.hasVoted === true
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 mr-1.5 rounded-full ${
                        mahasiswa.hasVoted === true
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    {mahasiswa.hasVoted === true
                      ? "Sudah Voting"
                      : "Belum Voting"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(mahasiswa)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors text-xs sm:text-sm"
                    >
                      <Edit3 size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(mahasiswa.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors text-xs sm:text-sm"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-4 py-8 text-center text-gray-500 bg-gray-50"
              >
                <div className="flex flex-col items-center">
                  <p className="text-base">
                    {searchTerm
                      ? "Tidak ada mahasiswa yang sesuai dengan pencarian"
                      : "Belum ada data mahasiswa"}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {sortedAndFilteredMahasiswas.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500 mb-3 sm:mb-0">
            Menampilkan {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, sortedAndFilteredMahasiswas.length)} dari{" "}
            {sortedAndFilteredMahasiswas.length} data mahasiswa
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center sm:justify-end">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page number buttons - show up to 5 pages */}
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  // Calculate page number for display
                  let pageNum;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // At beginning, show first 5
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // At end, show last 5
                    pageNum = totalPages - 4 + i;
                  } else {
                    // In middle, show current and 2 on each side
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MahasiswaTable;
