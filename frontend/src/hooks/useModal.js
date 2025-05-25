import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

export const useMahasiswaModals = () => {
  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const openEditModal = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    editModal.openModal();
  };

  const closeEditModal = () => {
    setSelectedMahasiswa(null);
    editModal.closeModal();
  };

  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    deleteModal.openModal();
  };

  const closeDeleteModal = () => {
    setDeleteUserId(null);
    deleteModal.closeModal();
  };

  return {
    // Add Modal
    showAddModal: addModal.isOpen,
    openAddModal: addModal.openModal,
    closeAddModal: addModal.closeModal,

    // Edit Modal
    showEditModal: editModal.isOpen,
    selectedMahasiswa,
    openEditModal,
    closeEditModal,

    // Delete Modal
    showDeleteModal: deleteModal.isOpen,
    deleteUserId,
    openDeleteModal,
    closeDeleteModal,
  };
};
