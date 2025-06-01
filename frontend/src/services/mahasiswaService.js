import apiClient from "../api/apiClient";

// Service untuk mengelola data mahasiswa
const mahasiswaService = {
  // Mengambil semua data mahasiswa
  getAllMahasiswa: async () => {
    try {
      const response = await apiClient.get("/users");

      // Konversi data dengan eksplisit
      return response.data.map((user) => ({
        ...user,
        // Pastikan hasVoted dikonversi ke boolean
        hasVoted: user.hasVoted === true || user.hasVoted === 1,
      }));
    } catch (error) {
      console.error("Error fetching mahasiswa:", error);
      throw error;
    }
  },

  // Menambah mahasiswa baru
  addMahasiswa: async (userData) => {
    try {
      const response = await apiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Gagal tambah mahasiswa:", error);
      throw error;
    }
  },

  // Edit data mahasiswa
  updateMahasiswa: async (id, userData) => {
    try {
      // Jika password kosong, hapus dari data yang dikirim
      const dataToSend = { ...userData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      const response = await apiClient.put(`/users/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      console.error("Gagal edit mahasiswa:", error);
      throw error;
    }
  },

  // Hapus mahasiswa
  deleteMahasiswa: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Gagal hapus mahasiswa:", error);
      throw error;
    }
  },

  // Import data mahasiswa dari Excel
  importFromExcel: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/users/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Gagal import Excel:", error);
      throw error;
    }
  },
};

export default mahasiswaService;
