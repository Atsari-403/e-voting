import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import KandidatForm from "./KandidatForm";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import { Trash2, RefreshCw, User, Users, Award } from "lucide-react";

const ManajemenKandidat = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("daftar"); // "daftar" atau "tambah"

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
    setActiveTab("daftar"); // Pindah ke tab daftar setelah menambahkan
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
    if (loading) {
      return (
        <div className="flex justify-center items-center p-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="ml-3 font-medium text-gray-600">
            Memuat data kandidat...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium">Terjadi Kesalahan</p>
          <p>{error}</p>
        </div>
      );
    }

    if (candidates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500 font-medium">
            Belum ada kandidat terdaftar.
          </p>
          <button
            onClick={() => setActiveTab("tambah")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Kandidat Sekarang
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Foto Profil Kandidat */}
              <div className="flex flex-row md:flex-col gap-4 items-center">
                <div className="relative">
                  {candidate.fotoKetua ? (
                    <img
                      src={`http://localhost:5000${candidate.fotoKetua}`}
                      alt="Foto Ketua"
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full ring-4 ring-blue-100"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Ketua
                  </span>
                </div>

                <div className="relative">
                  {candidate.fotoWakil ? (
                    <img
                      src={`http://localhost:5000${candidate.fotoWakil}`}
                      alt="Foto Wakil"
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full ring-4 ring-blue-100"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Wakil
                  </span>
                </div>
              </div>

              {/* Informasi Kandidat */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {candidate.nameKetua} & {candidate.nameWakil}
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="flex items-center text-gray-700 font-semibold">
                          <Award className="w-5 h-5 mr-2 text-blue-600" /> Visi
                        </h4>
                        <p className="mt-1 text-gray-600 pl-7">
                          {candidate.visi}
                        </p>
                      </div>

                      <div>
                        <h4 className="flex items-center text-gray-700 font-semibold">
                          <Award className="w-5 h-5 mr-2 text-green-600" /> Misi
                        </h4>
                        <p className="mt-1 text-gray-600 pl-7">
                          {candidate.misi}
                        </p>
                      </div>
                    </div>
                  </div>

                  {candidate.fotoPamflet && (
                    <div className="ml-4 hidden md:block">
                      <img
                        src={`http://localhost:5000${candidate.fotoPamflet}`}
                        alt="Pamflet"
                        className="w-32 h-32 object-cover rounded-lg shadow"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Kandidat
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h1 className="text-2xl font-bold text-white">
              Manajemen Kandidat
            </h1>
            <p className="text-blue-100 mt-1">
              Kelola data kandidat untuk pemilihan
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("daftar")}
                className={`px-6 py-3 font-medium flex items-center ${
                  activeTab === "daftar"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Daftar Kandidat
              </button>
              <button
                onClick={() => setActiveTab("tambah")}
                className={`px-6 py-3 font-medium flex items-center ${
                  activeTab === "tambah"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Tambah Kandidat
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {activeTab === "daftar" ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Daftar Kandidat
                  </h2>
                  <button
                    onClick={() => setRefreshKey((prevKey) => prevKey + 1)}
                    className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
                {renderCandidateList()}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Tambah Kandidat Baru
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <KandidatForm onSuccess={handleCandidateAdded} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ManajemenKandidat;
