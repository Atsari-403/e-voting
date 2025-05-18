import axios from "axios";

// Base URL API
const API_URL = "http://localhost:5000/api";

// Service untuk mengelola data mahasiswa
const mahasiswaService = {
  // Mengambil semua data mahasiswa
  getAllMahasiswa: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });

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
      const response = await axios.post(`${API_URL}/users`, userData, {
        withCredentials: true,
      });
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

      const response = await axios.put(`${API_URL}/users/${id}`, dataToSend, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Gagal edit mahasiswa:", error);
      throw error;
    }
  },

  // Hapus mahasiswa
  deleteMahasiswa: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`, {
        withCredentials: true,
      });
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

      const response = await axios.post(`${API_URL}/users/import`, formData, {
        withCredentials: true,
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
