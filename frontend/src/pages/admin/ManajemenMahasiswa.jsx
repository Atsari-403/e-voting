import React from "react";
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

// Custom Hooks
import {
  useMahasiswa,
  useMahasiswaModals,
  useFileUpload,
  useSearch,
} from "../../hooks";

const ManajemenMahasiswa = () => {
  // Data & Operations
  const {
    mahasiswas,
    isLoading,
    addMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    importFromExcel,
  } = useMahasiswa();

  // Modal States
  const {
    showAddModal,
    openAddModal,
    closeAddModal,
    showEditModal,
    selectedMahasiswa,
    openEditModal,
    closeEditModal,
    showDeleteModal,
    deleteUserId,
    openDeleteModal,
    closeDeleteModal,
  } = useMahasiswaModals();

  // Search Functionality
  const { searchTerm, setSearchTerm } = useSearch(mahasiswas, [
    "nim",
    "name",
    "email",
  ]);

  // File Upload
  const { fileInputRef } = useFileUpload(importFromExcel);

  // Event Handlers
  const handleAddMahasiswa = async (userData) => {
    const result = await addMahasiswa(userData);
    if (result.success) {
      closeAddModal();
    }
  };

  const handleEditMahasiswa = async (userData) => {
    const result = await updateMahasiswa(userData);
    if (result.success) {
      closeEditModal();
    }
  };

  const handleDeleteMahasiswa = async () => {
    const result = await deleteMahasiswa(deleteUserId);
    if (result.success) {
      closeDeleteModal();
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        {/* Header dan Tombol Aksi */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="order-2 md:order-1">
            <MahasiswaActionButtons
              onAddClick={openAddModal}
              fileInputRef={fileInputRef}
            />
          </div>

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
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </div>

        {/* Modal Tambah Mahasiswa */}
        <ModalComponent
          isOpen={showAddModal}
          title="Tambah Mahasiswa"
          onClose={closeAddModal}
        >
          <AddMahasiswaForm
            onClose={closeAddModal}
            onSubmit={handleAddMahasiswa}
          />
        </ModalComponent>

        {/* Modal Edit Mahasiswa */}
        {selectedMahasiswa && (
          <ModalComponent
            isOpen={showEditModal}
            title="Edit Mahasiswa"
            onClose={closeEditModal}
          >
            <EditMahasiswaForm
              mahasiswa={selectedMahasiswa}
              onClose={closeEditModal}
              onSubmit={handleEditMahasiswa}
            />
          </ModalComponent>
        )}

        {/* Modal Hapus Mahasiswa */}
        <ModalComponent
          isOpen={showDeleteModal}
          title="Konfirmasi Hapus"
          onClose={closeDeleteModal}
        >
          <DeleteConfirmation
            onClose={closeDeleteModal}
            onDelete={handleDeleteMahasiswa}
          />
        </ModalComponent>
      </div>
    </AdminDashboardLayout>
  );
};

export default ManajemenMahasiswa;
