import { useState, useEffect, useCallback } from "react";
import mahasiswaService from "../services/mahasiswaService";
import Swal from "sweetalert2";

export const useMahasiswa = () => {
  const [mahasiswas, setMahasiswas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data mahasiswa
  const fetchMahasiswas = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mahasiswaService.getAllMahasiswa();
      setMahasiswas(data);
    } catch (error) {
      console.error("Error fetch:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal mengambil data mahasiswa",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMahasiswas(); // Initial fetch

    // set interval 
    const interval = setInterval(() => {
      fetchMahasiswas();
    }, 180000);

    return () => clearInterval(interval);
  }, [fetchMahasiswas]);

  // Handler tambah mahasiswa
  const addMahasiswa = async (userData) => {
    try {
      await mahasiswaService.addMahasiswa(userData);
      fetchMahasiswas();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Mahasiswa berhasil ditambahkan",
        timer: 2000,
        showConfirmButton: false,
      });

      return { success: true };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menambahkan!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat menambahkan mahasiswa",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });

      return { success: false, error };
    }
  };

  // Handler edit mahasiswa
  const updateMahasiswa = async (userData) => {
    try {
      await mahasiswaService.updateMahasiswa(userData.id, userData);
      fetchMahasiswas();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data mahasiswa berhasil diperbarui",
        timer: 2000,
        showConfirmButton: false,
      });

      return { success: true };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengedit!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat mengedit mahasiswa",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });

      return { success: false, error };
    }
  };

  // Handler hapus mahasiswa
  const deleteMahasiswa = async (userId) => {
    try {
      await mahasiswaService.deleteMahasiswa(userId);
      fetchMahasiswas();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Mahasiswa berhasil dihapus",
        timer: 2000,
        showConfirmButton: false,
      });

      return { success: true };
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat menghapus mahasiswa",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });

      return { success: false, error };
    }
  };

  // Handler upload excel
  const importFromExcel = async (file) => {
    try {
      await mahasiswaService.importFromExcel(file);

      Swal.fire({
        icon: "success",
        title: "Import Berhasil!",
        text: "Data mahasiswa berhasil diimpor dari Excel",
        timer: 3000,
        showConfirmButton: false,
      });

      fetchMahasiswas();
      return { success: true };
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat mengimpor data";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (error.response.data.missingColumns) {
          const missing = [];
          const missingCols = error.response.data.missingColumns;

          if (missingCols.NIM) missing.push("NIM");
          if (missingCols.Nama) missing.push("Nama");
          if (missingCols.Password) missing.push("Password");

          if (missing.length > 0) {
            errorMessage +=
              "\n\nKolom yang tidak ditemukan: " + missing.join(", ");
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Import Gagal!",
        html: errorMessage.replace(/\n/g, "<br>"),
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        width: "600px",
      });

      return { success: false, error };
    }
  };

  return {
    mahasiswas,
    isLoading,
    addMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    importFromExcel,
    refreshData: fetchMahasiswas,
  };
};
