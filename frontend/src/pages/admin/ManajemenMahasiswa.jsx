import React, { useState, useEffect, useRef, useCallback } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import ModalComponent from "../../components/admin/common/ModalComponent";
import {
  AddMahasiswaForm,
  EditMahasiswaForm,
  DeleteConfirmation,
  MahasiswaTable,
  MahasiswaSearchBar,
  MahasiswaActionButtons,
} from "../../components/admin/mahasiswa";
import mahasiswaService from "../../services/mahasiswaService";

const ManajemenMahasiswa = () => {
  // State
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
      // console.log("Mengambil data mahasiswa...");
      const data = await mahasiswaService.getAllMahasiswa();

      // Debug setiap user
      // data.forEach((user) => {
      //   console.log("Data mahasiswa:", {
      //     nim: user.nim,
      //     nama: user.name,
      //     hasVoted: user.hasVoted,
      //     tipeData: typeof user.hasVoted,
      //   });
      // });

      setMahasiswas(data);
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
      // console.log("Memulai polling data...");
      fetchMahasiswas();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchMahasiswas]);

  // Handler tambah mahasiswa
  const handleAddMahasiswa = async (userData) => {
    try {
      await mahasiswaService.addMahasiswa(userData);
      setShowModal(false);
      fetchMahasiswas();
    } catch (error) {
      alert(
        "Gagal menambahkan mahasiswa: " +
          (error.response?.data?.message || error.message || "Error")
      );
    }
  };

  // Handler edit mahasiswa
  const handleEditMahasiswa = async (userData) => {
    try {
      await mahasiswaService.updateMahasiswa(userData.id, userData);
      setShowEditModal(false);
      setSelectedMahasiswa(null);
      fetchMahasiswas();
    } catch (error) {
      alert(
        "Gagal mengedit mahasiswa: " +
          (error.response?.data?.message || error.message || "Error")
      );
    }
  };

  // Handler hapus mahasiswa
  const handleDeleteMahasiswa = async () => {
    try {
      await mahasiswaService.deleteMahasiswa(deleteUserId);
      setShowDeleteModal(false);
      setDeleteUserId(null);
      fetchMahasiswas();
    } catch (error) {
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

    try {
      await mahasiswaService.importFromExcel(file);
      alert("Import Excel berhasil!");
      fetchMahasiswas();
    } catch (error) {
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

  // Setup ref untuk file upload dengan handler
  if (fileInputRef.current) {
    fileInputRef.current.onFileChange = handleExcelUpload;
  }

  // Handlers untuk tabel
  const handleEditClick = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        {/* Header dan Tombol Aksi dalam satu container */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Tombol Aksi */}
          <div className="order-2 md:order-1">
            <MahasiswaActionButtons
              onAddClick={() => setShowModal(true)}
              fileInputRef={fileInputRef}
            />
          </div>

          {/* Search input */}
          <div className="order-1 md:order-2">
            <MahasiswaSearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* Tabel Mahasiswa */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
          <MahasiswaTable
            mahasiswas={mahasiswas}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
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
