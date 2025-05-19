import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const response = await axios.get("http://localhost:5000/api/candidates", {
        withCredentials: true,
      });

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

  // Handler untuk menghapus kandidat
  const handleDeleteCandidate = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/candidates/${id}`, {
        withCredentials: true,
      });

      refreshCandidates();
      alert("Kandidat berhasil dihapus");
    } catch (error) {
      console.error("Error saat menghapus kandidat:", error);
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      alert("Gagal menghapus kandidat. Silakan coba lagi.");
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
