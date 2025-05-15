import React, { useState, useEffect, useRef, useCallback } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import axios from "axios";
import { Plus, Upload, Trash2, Edit3, User, Search } from "lucide-react";

// Komponen modal yang terpisah untuk menghindari re-render komponen utama
const ModalComponent = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md mx-4"
        onClick={handleContentClick}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Komponen form tambah mahasiswa
const AddMahasiswaForm = ({ onClose, onSubmit }) => {
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

// Komponen form edit mahasiswa
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

// Komponen konfirmasi hapus
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

const ManajemenMahasiswa = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [mahasiswas, setMahasiswas] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  // Fungsi untuk mengambil data mahasiswa
  const fetchMahasiswas = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Mengambil data mahasiswa...");
      const response = await axios.get("http://localhost:5000/api/users", {
        withCredentials: true,
      });

      // Konversi data dengan eksplisit
      const processedData = response.data.map((user) => ({
        ...user,
        // Pastikan hasVoted dikonversi ke boolean
        hasVoted: user.hasVoted === true || user.hasVoted === 1,
      }));

      // Debug setiap user
      processedData.forEach((user) => {
        console.log("Data mahasiswa:", {
          nim: user.nim,
          nama: user.name,
          hasVoted: user.hasVoted,
          tipeData: typeof user.hasVoted,
        });
      });

      setMahasiswas(processedData);
    } catch (error) {
      console.error("Error fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMahasiswas(); // Initial fetch

    // Polling setiap 10 detik
    const interval = setInterval(() => {
      console.log("Memulai polling data...");
      fetchMahasiswas();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchMahasiswas]);

  // Handler tambah mahasiswa
  const handleAddMahasiswa = async (userData) => {
    try {
      await axios.post("http://localhost:5000/api/users", userData, {
        withCredentials: true,
      });
      setShowModal(false);
      fetchMahasiswas();
    } catch (error) {
      console.error("Gagal tambah mahasiswa:", error.response?.data || error);
      alert(
        "Gagal menambahkan mahasiswa: " +
          (error.response?.data?.message || error.message || "Error")
      );
    }
  };

  // Handler edit mahasiswa
  const handleEditMahasiswa = async (userData) => {
    try {
      // Jika password kosong, hapus dari data yang dikirim
      const dataToSend = { ...userData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await axios.put(
        `http://localhost:5000/api/users/${userData.id}`,
        dataToSend,
        {
          withCredentials: true,
        }
      );
      setShowEditModal(false);
      setSelectedMahasiswa(null);
      fetchMahasiswas();
    } catch (error) {
      console.error("Gagal edit mahasiswa:", error.response?.data || error);
      alert(
        "Gagal mengedit mahasiswa: " +
          (error.response?.data?.message || error.message || "Error")
      );
    }
  };

  // Handler hapus mahasiswa
  const handleDeleteMahasiswa = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteUserId}`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      setDeleteUserId(null);
      fetchMahasiswas();
    } catch (error) {
      console.error("Gagal hapus mahasiswa:", error.response?.data || error);
      alert(
        "Gagal menghapus mahasiswa: " +
          (error.response?.data?.message || error.message || "Error")
      );
    }
  };

  // Handler upload excel
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/import",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Import Excel berhasil!");
      fetchMahasiswas();
    } catch (error) {
      console.error("Gagal import Excel:", error.response?.data || error);

      // Handle specific error messages
      let errorMessage = "Gagal import Excel: ";

      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;

        // Tambahkan informasi kolom yang hilang jika ada
        if (error.response.data.missingColumns) {
          const missing = [];
          const missingCols = error.response.data.missingColumns;

          if (missingCols.NIM) missing.push("NIM");
          if (missingCols.Nama) missing.push("Nama");
          if (missingCols.Password) missing.push("Password");

          if (missing.length > 0) {
            errorMessage +=
              "\nKolom yang tidak ditemukan: " + missing.join(", ");
          }
        }
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Terjadi kesalahan saat mengimpor data";
      }

      alert(errorMessage);
    }

    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filter mahasiswa berdasarkan pencarian
  const filteredMahasiswas = mahasiswas.filter(
    (mahasiswa) =>
      mahasiswa.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mahasiswa.name &&
        mahasiswa.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        {/* Header dan Tombol Aksi dalam satu container */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-3 order-2 md:order-1">
            <button
              onClick={() => setShowModal(true)}
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
              onChange={handleExcelUpload}
              className="hidden"
            />
          </div>

          {/* Search input */}
          <div className="relative order-1 md:order-2">
            <input
              type="text"
              placeholder="Cari NIM atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full md:w-64"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
        </div>

        {/* Tabel Mahasiswa */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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
                        {console.log(
                          "Rendering status:",
                          mahasiswa.nim,
                          mahasiswa.hasVoted
                        )}
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
                          onClick={() => {
                            setSelectedMahasiswa(mahasiswa);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteUserId(mahasiswa.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={16} /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "Tidak ada mahasiswa yang sesuai dengan pencarian"
                        : "Belum ada data mahasiswa"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Tambah Mahasiswa */}
        <ModalComponent
          isOpen={showModal}
          title="Tambah Mahasiswa"
          onClose={() => setShowModal(false)}
        >
          <AddMahasiswaForm
            onClose={() => setShowModal(false)}
            onSubmit={handleAddMahasiswa}
          />
        </ModalComponent>

        {/* Modal Edit Mahasiswa */}
        {selectedMahasiswa && (
          <ModalComponent
            isOpen={showEditModal}
            title="Edit Mahasiswa"
            onClose={() => {
              setShowEditModal(false);
              setSelectedMahasiswa(null);
            }}
          >
            <EditMahasiswaForm
              mahasiswa={selectedMahasiswa}
              onClose={() => {
                setShowEditModal(false);
                setSelectedMahasiswa(null);
              }}
              onSubmit={handleEditMahasiswa}
            />
          </ModalComponent>
        )}

        {/* Modal Hapus Mahasiswa */}
        <ModalComponent
          isOpen={showDeleteModal}
          title="Konfirmasi Hapus"
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteUserId(null);
          }}
        >
          <DeleteConfirmation
            onClose={() => {
              setShowDeleteModal(false);
              setDeleteUserId(null);
            }}
            onDelete={handleDeleteMahasiswa}
          />
        </ModalComponent>
      </div>
    </AdminDashboardLayout>
  );
};

export default ManajemenMahasiswa;
