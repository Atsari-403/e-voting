import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import KandidatForm from "./KandidatForm";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";

const ManajemenKandidat = () => {
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

  useEffect(() => {
    fetchCandidates();
  }, [refreshKey]);

  // Handler ketika kandidat berhasil ditambahkan
  const handleCandidateAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Handler untuk menghapus kandidat
  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kandidat ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/candidates/${id}`, {
          withCredentials: true,
        });

        handleCandidateAdded();
        alert("Kandidat berhasil dihapus");
      } catch (error) {
        console.error("Error saat menghapus kandidat:", error);
        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }
        alert("Gagal menghapus kandidat. Silakan coba lagi.");
      }
    }
  };

  const renderCandidateList = () => {
    if (loading) return <p>Memuat data kandidat...</p>;
    if (error)
      return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
    if (candidates.length === 0) return <p>Belum ada kandidat terdaftar.</p>;

    return (
      <div className="space-y-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="p-4 border rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">
                  {candidate.nameKetua} & {candidate.nameWakil}
                </h3>
                <p className="mt-2">
                  <strong>Visi:</strong> {candidate.visi}
                </p>
                <p className="mt-2">
                  <strong>Misi:</strong> {candidate.misi}
                </p>
              </div>

              {candidate.fotoPamflet && (
                <div className="ml-4">
                  <img
                    src={`http://localhost:5000${candidate.fotoPamflet}`}
                    alt="Pamflet"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleDeleteCandidate(candidate.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Manajemen Kandidat</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Tambah Kandidat Baru</h2>
            <KandidatForm onSuccess={handleCandidateAdded} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Daftar Kandidat</h2>
            {renderCandidateList()}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ManajemenKandidat;
