import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import candidateService from "../services/candidateService";

const useCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fungsi untuk mengambil data kandidat
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getAllCandidates();

      setCandidates(response.data);
      setError("");
    } catch (error) {
      console.error("Error saat mengambil data kandidat:", error);
      if (error.response?.status === 401) {
        setError("Sesi telah berakhir. Silakan login ulang.");
        navigate("/login");
        return;
      }
      setError("Gagal memuat data kandidat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk fetch data ketika component mount atau refreshKey berubah
  useEffect(() => {
    fetchCandidates();
  }, [refreshKey]);

  // Handler untuk refresh data
  const refreshCandidates = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Handler untuk menghapus kandidat dengan SweetAlert
  const handleDeleteCandidate = async (id, candidateName = "kandidat") => {
    try {
      // Tampilkan konfirmasi SweetAlert
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: `Data ${candidateName} akan dihapus secara permanen!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
        reverseButtons: true,
      });

      // Jika user konfirmasi hapus
      if (result.isConfirmed) {
        // Loading saat proses hapus
        Swal.fire({
          title: "Menghapus...",
          text: "Sedang menghapus data kandidat",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Kirim request hapus ke API
        await candidateService.deleteCandidate(id);

        // Refresh data setelah berhasil hapus
        refreshCandidates();

        // Tampilkan pesan sukses
        Swal.fire({
          title: "Berhasil!",
          text: `${candidateName} telah dihapus.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error saat menghapus kandidat:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      // Tampilkan pesan error dengan SweetAlert
      Swal.fire({
        title: "Error!",
        text: "Gagal menghapus kandidat. Silakan coba lagi.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return {
    candidates,
    loading,
    error,
    refreshCandidates,
    handleDeleteCandidate,
  };
};

export default useCandidates;
