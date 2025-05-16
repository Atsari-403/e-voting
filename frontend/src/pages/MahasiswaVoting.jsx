import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import {
  Clock,
  CheckCircle,
  Info,
  ChevronRight,
  X,
  AlertTriangle,
  Check,
  LogOut,
} from "lucide-react";

const MahasiswaVoting = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [hasVoted, setHasVoted] = useState(false); // Add state to track if user has voted
  const navigate = useNavigate();

  // Base URL untuk gambar
  const baseImageUrl = "http://localhost:5000/uploads/";

  // Fungsi untuk memformat path gambar dengan benar
  const formatImagePath = (path) => {
    if (!path) return null;

    // Jika path sudah lengkap dengan http/https, gunakan langsung
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Hapus /uploads/ dari path jika ada
    let formattedPath = path;
    if (path.startsWith("/uploads/")) {
      formattedPath = path.replace("/uploads/", "");
    }

    // Hapus slash di awal jika ada
    if (formattedPath.startsWith("/")) {
      formattedPath = formattedPath.substring(1);
    }

    return `${baseImageUrl}${formattedPath}`;
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Periksa status voting user saat komponen dimount
  useEffect(() => {
    const checkUserVoteStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        // Set state hasVoted berdasarkan data dari server
        setHasVoted(response.data.hasVoted);

        // Jika user sudah memilih, tampilkan notifikasi
        if (response.data.hasVoted) {
          setError(
            "Anda sudah memberikan suara sebelumnya. Tombol voting telah dinonaktifkan."
          );
        }

        // console.log("User vote status:", response.data.hasVoted);
      } catch (err) {
        console.error("Error checking user vote status:", err);
        // Jika gagal mengecek status, asumsikan user belum memilih
      }
    };

    checkUserVoteStatus();
  }, []);

  // Fetch candidates on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/candidates",
          { withCredentials: true }
        );
        setCandidates(response.data);
        setLoading(false);

        // Log untuk debugging
        // console.log("Candidates data:", response.data);
      } catch (err) {
        setError("Gagal memuat data kandidat");
        console.error("Error fetching candidates:", err);
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Waktu voting telah habis!");
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // Handle candidate selection
  const handleSelectCandidate = (candidate) => {
    // Jika user sudah memilih, jangan izinkan untuk memilih lagi
    if (hasVoted) {
      setError(
        "Anda sudah memberikan suara sebelumnya. Tidak dapat memilih kandidat lagi."
      );
      return;
    }

    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  // Submit vote
  const handleConfirmVote = async () => {
    try {
      setLoading(true);
      // console.log("Sending vote request:", {
      //   candidateId: selectedCandidate.id,
      //   timestamp: new Date().toISOString(),
      // });

      const response = await axios.post(
        "http://localhost:5000/api/users/vote-candidate",
        {
          candidateId: selectedCandidate.id,
        },
        { withCredentials: true }
      );

      // console.log("Vote response:", {
      //   status: response.status,
      //   data: response.data,
      //   timestamp: new Date().toISOString(),
      // });

      // Update local state setelah berhasil voting
      setHasVoted(true);

      alert("Voting berhasil dilakukan!");
      navigate("/voting-success");
    } catch (err) {
      console.error("Vote error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      // Jika error karena user sudah memilih, update state hasVoted
      if (err.response?.data?.hasVoted) {
        setHasVoted(true);
      }

      setError(
        "Gagal melakukan voting: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Gagal melakukan logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Navbar Putih dengan Aksen Modern dan Colorful */}
      <header className="bg-white text-gray-800 shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="E-Voting Logo" className="h-8" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              E-Voting Mahasiswa
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-4 rounded-lg text-white shadow-md flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* tombol logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner untuk User yang Sudah Memilih */}
      {hasVoted && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                Anda sudah memberikan suara sebelumnya.
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Anda masih dapat melihat kandidat, namun tidak dapat memberikan
                suara lagi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-gradient-to-r from-white to-blue-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 w-1 h-8 rounded mr-3"></span>
            Pemilihan Kandidat
          </h2>
          <p className="text-gray-600 ml-4">
            Silakan pilih kandidat yang ingin Anda dukung untuk masa depan yang
            lebih baik
          </p>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-700">Memuat data...</p>
            </div>
          </div>
        )}

        {error &&
          !hasVoted && ( // Tampilkan error kecuali jika ini adalah pesan hasVoted yang sudah ditampilkan di banner
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handleSelectCandidate(candidate)}
            >
              {/* Pasangan Foto Kandidat */}
              {candidate.designType === "combined" ? (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={
                      formatImagePath(candidate.fotoPamflet) ||
                      "/placeholder-candidate.png"
                    }
                    alt={`Pasangan ${candidate.nameKetua} & ${candidate.nameWakil}`}
                    className="object-cover w-full h-48"
                    onError={(e) => {
                      e.target.src = "/placeholder-candidate.png";
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-48">
                  <div className="w-1/2 bg-gray-100 relative">
                    <img
                      src={
                        formatImagePath(candidate.fotoKetua) ||
                        "/placeholder-ketua.png"
                      }
                      alt={`Foto ${candidate.nameKetua}`}
                      className="object-cover w-full h-48"
                      onError={(e) => {
                        e.target.src = "/placeholder-ketua.png";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-tr-md font-medium">
                      Ketua
                    </div>
                  </div>
                  <div className="w-1/2 bg-gray-100 relative">
                    <img
                      src={
                        formatImagePath(candidate.fotoWakil) ||
                        "/placeholder-wakil.png"
                      }
                      alt={`Foto ${candidate.nameWakil}`}
                      className="object-cover w-full h-48"
                      onError={(e) => {
                        e.target.src = "/placeholder-wakil.png";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-2 py-1 rounded-tr-md font-medium">
                      Wakil
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs font-bold inline-block">
                    Pasangan #{candidate.id}
                  </div>
                  <div className="bg-gray-100 h-6 w-6 rounded-full flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  {candidate.nameKetua} & {candidate.nameWakil}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-indigo-600">
                      Visi:
                    </h4>
                    <p className="text-gray-700 text-sm mt-1">
                      {candidate.visi}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-purple-600">
                      Misi:
                    </h4>
                    <p className="text-gray-700 text-sm mt-1">
                      {candidate.misi}
                    </p>
                  </div>
                </div>
                <button
                  className={`mt-5 w-full ${
                    hasVoted
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  } text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasVoted) {
                      handleSelectCandidate(candidate);
                    }
                  }}
                  disabled={hasVoted}
                >
                  <span>{hasVoted ? "Sudah Memilih" : "Pilih Kandidat"}</span>
                  {hasVoted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions Section */}
        <div className="mt-8 bg-gradient-to-r from-white to-indigo-50 rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-full mr-3">
              <Info className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              Petunjuk Voting
            </h3>
          </div>
          <div className="pl-10">
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <div className="bg-indigo-100 h-5 w-5 rounded-full flex items-center justify-center mr-2">
                  <span className="text-indigo-600 text-xs font-bold">1</span>
                </div>
                <span>
                  Pilih salah satu kandidat dengan mengklik kartu atau tombol
                  "Pilih Kandidat"
                </span>
              </li>
              <li className="flex items-center text-gray-700">
                <div className="bg-purple-100 h-5 w-5 rounded-full flex items-center justify-center mr-2">
                  <span className="text-purple-600 text-xs font-bold">2</span>
                </div>
                <span>Konfirmasi pilihan Anda pada jendela yang muncul</span>
              </li>
              <li className="flex items-center text-gray-700">
                <div className="bg-pink-100 h-5 w-5 rounded-full flex items-center justify-center mr-2">
                  <span className="text-pink-600 text-xs font-bold">3</span>
                </div>
                <span>Setelah konfirmasi, pilihan Anda tidak dapat diubah</span>
              </li>
              <li className="flex items-center text-gray-700">
                <div className="bg-blue-100 h-5 w-5 rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-xs font-bold">4</span>
                </div>
                <span>Waktu voting dibatasi 15 menit</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                Konfirmasi Pilihan
              </h3>
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-5 border border-indigo-100">
              <div className="flex items-center space-x-4">
                {/* Tampilkan foto berdasarkan designType */}
                {selectedCandidate.designType === "combined" ? (
                  <img
                    src={
                      formatImagePath(selectedCandidate.fotoPamflet) ||
                      "/placeholder-candidate.png"
                    }
                    alt={`Foto ${selectedCandidate.nameKetua} & ${selectedCandidate.nameWakil}`}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder-candidate.png";
                    }}
                  />
                ) : (
                  <div className="flex space-x-2">
                    <div className="relative">
                      <img
                        src={
                          formatImagePath(selectedCandidate.fotoKetua) ||
                          "/placeholder-ketua.png"
                        }
                        alt={`Foto ${selectedCandidate.nameKetua}`}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder-ketua.png";
                        }}
                      />
                      <div className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-1 rounded-md">
                        K
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src={
                          formatImagePath(selectedCandidate.fotoWakil) ||
                          "/placeholder-wakil.png"
                        }
                        alt={`Foto ${selectedCandidate.nameWakil}`}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder-wakil.png";
                        }}
                      />
                      <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-1 rounded-md">
                        W
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">
                    {selectedCandidate.nameKetua} &{" "}
                    {selectedCandidate.nameWakil}
                  </p>
                  <p className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
                    Pasangan #
                    {selectedCandidate.nomorUrut || selectedCandidate.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Apakah Anda yakin ingin memilih kandidat ini? Pilihan tidak
                    dapat diubah setelah dikonfirmasi.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium"
                onClick={() => setShowConfirmation(false)}
              >
                Batal
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm flex justify-center items-center space-x-2"
                onClick={handleConfirmVote}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Konfirmasi Pilihan</span>
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaVoting;
