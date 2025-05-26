import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import {
  Clock,
  CheckCircle,
  Info,
  ChevronRight,
  X,
  AlertTriangle,
  Check,
  LogOut,
  Star,
  Award,
} from "lucide-react";

const MahasiswaVoting = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // Base URL untuk gambar
  const baseImageUrl = "http://localhost:5000/uploads/";

  // Fungsi memformat path gambar dengan benar
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

  // Periksa status voting user dan fetch user data saat komponen dimount
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        setUserData(response.data);
        // Set state hasVoted berdasarkan data dari server
        setHasVoted(response.data.hasVoted);

        // Jika user sudah memilih, tampilkan notifikasi
        if (response.data.hasVoted) {
          setError(
            "Anda sudah memberikan suara sebelumnya. Tombol voting telah dinonaktifkan."
          );
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        // Jika gagal mengecek status, redirect ke login
        navigate("/");
      }
    };

    checkUserStatus();
  }, [navigate]);

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
      } catch (err) {
        setError("Gagal memuat data kandidat");
        console.error("Error fetching candidates:", err);
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Timer countdown - FIXED: Stop timer if user has voted
  useEffect(() => {
    // Jika user sudah voting, jangan aktifkan timer
    if (hasVoted) {
      return;
    }

    if (timeLeft <= 0) {
      setTimeExpired(true);
      setError(
        "Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi."
      );
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasVoted]);

  // Handle candidate selection
  const handleSelectCandidate = (candidate) => {
    // Jika user sudah memilih atau waktu habis, jangan izinkan untuk memilih
    if (hasVoted) {
      setError(
        "Anda sudah memberikan suara sebelumnya. Tidak dapat memilih kandidat lagi."
      );
      return;
    }

    if (timeExpired) {
      setError(
        "Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi."
      );
      return;
    }

    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  // Submit vote
  const handleConfirmVote = async () => {
    // Cek lagi jika waktu sudah habis sebelum mengirim vote
    if (timeExpired) {
      setError(
        "Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi."
      );
      setShowConfirmation(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/users/vote-candidate",
        {
          candidateId: selectedCandidate.id,
        },
        { withCredentials: true }
      );

      // Update local state setelah berhasil voting
      setHasVoted(true);
      setShowConfirmation(false);

      //  modal sukses
      setShowSuccessModal(true);

      // Tutup modal sukses setelah 3 detik
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col">
      {/* Header - Navbar dengan Design Modern dan Responsif */}
      <header className="bg-white text-gray-800 shadow-md border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo dan Info User */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <img
                src={logo}
                alt="E-Voting Logo"
                className="h-6 sm:h-8 flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-xs sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent truncate">
                  E-Voting Mahasiswa
                </h1>
                {userData && (
                  <span className="text-xs text-gray-500 truncate">
                    Hai, {userData.name || userData.nim}
                  </span>
                )}
              </div>
            </div>

            {/* Timer dan Logout dalam satu baris */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div
                className={`${
                  timeExpired
                    ? "bg-red-600"
                    : hasVoted
                    ? "bg-green-600"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                } py-1 sm:py-2 px-2 sm:px-3 rounded-lg text-white shadow-md flex items-center`}
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="font-mono text-xs sm:text-sm font-medium">
                  {timeExpired
                    ? "00:00"
                    : hasVoted
                    ? "Done"
                    : formatTime(timeLeft)}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white py-1 sm:py-2 px-2 sm:px-3 rounded-lg shadow-md transition-colors text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content with Improved Responsive Visual Design */}
      <main className="container mx-auto px-4 py-4 sm:py-8 flex-grow">
        {/* Status Banners */}
        <div className="mb-4 sm:mb-6">
          {/* Info Banner untuk User yang Sudah Memilih */}
          {hasVoted && (
            <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 mb-4 rounded-md shadow-sm animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-green-800">
                    Terima kasih atas partisipasi Anda!
                  </p>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">
                    Anda sudah memberikan suara. Anda masih dapat melihat
                    kandidat, namun tidak dapat memberikan suara lagi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Banner untuk Waktu Habis */}
          {timeExpired && !hasVoted && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 rounded-md shadow-sm animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-red-800">
                    Waktu voting telah habis!
                  </p>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">
                    Anda tidak dapat memberikan suara lagi karena batas waktu
                    sudah berakhir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page Title Section with Improved Visual Design */}
        <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 w-1 h-6 sm:h-8 rounded mr-3"></span>
              Pemilihan Kandidat
            </h2>
            <p className="text-sm sm:text-base text-gray-600 ml-4">
              Silakan pilih kandidat yang ingin Anda dukung untuk masa depan
              yang lebih baik
            </p>

            {/* Countdown timer display for visual emphasis */}
            {!hasVoted && !timeExpired && (
              <div className="mt-3 sm:mt-4 ml-4 inline-flex items-center bg-blue-50 px-2 sm:px-3 py-1 rounded-full border border-blue-100">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">
                  Waktu tersisa: {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white p-6 sm:p-8 rounded-xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Memuat data kandidat...
              </p>
            </div>
          </div>
        )}

        {error && !hasVoted && !timeExpired && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md shadow-sm mb-4 sm:mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Cards with Improved Responsive Visual Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 transform ${
                !hasVoted && !timeExpired
                  ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  : ""
              }`}
              onClick={() =>
                !hasVoted && !timeExpired && handleSelectCandidate(candidate)
              }
            >
              {/* Badge penunjuk nomor pasangan - DIMODIFIKASI */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                <div className="bg-white shadow-md rounded-full px-2 sm:px-3 py-1 flex items-center space-x-1">
                  <Star className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-gray-800">
                    Pasangan #{index + 1}
                  </span>
                </div>
              </div>

              {/* Pasangan Foto Kandidat - Responsive height */}
              {candidate.designType === "combined" ? (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative h-40 sm:h-52">
                  <img
                    src={
                      formatImagePath(candidate.fotoPamflet) ||
                      "/placeholder-candidate.png"
                    }
                    alt={`Pasangan ${candidate.nameKetua} & ${candidate.nameWakil}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = "/placeholder-candidate.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                    <h3 className="font-bold text-sm sm:text-lg">
                      {candidate.nameKetua} & {candidate.nameWakil}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="flex h-40 sm:h-52 relative">
                  <div className="w-1/2 bg-gray-100 relative">
                    <img
                      src={
                        formatImagePath(candidate.fotoKetua) ||
                        "/placeholder-ketua.png"
                      }
                      alt={`Foto ${candidate.nameKetua}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = "/placeholder-ketua.png";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-whitexs px-2 py-1 rounded-bl-md font-medium text-xs">
                      Ketua
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                      <h4 className="font-medium text-xs sm:text-sm">
                        {candidate.nameKetua}
                      </h4>
                    </div>
                  </div>
                  <div className="w-1/2 bg-gray-100 relative">
                    <img
                      src={
                        formatImagePath(candidate.fotoWakil) ||
                        "/placeholder-wakil.png"
                      }
                      alt={`Foto ${candidate.nameWakil}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = "/placeholder-wakil.png";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-500 text-white px-2 py-1 rounded-bl-md font-medium text-xs">
                      Wakil
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                      <h4 className="font-medium text-xs sm:text-sm">
                        {candidate.nameWakil}
                      </h4>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 sm:p-5">
                <div className="flex justify-between items-center mb-3 sm:mb-5">
                  <h3 className="font-bold text-sm sm:text-lg text-gray-800">
                    {!candidate.designType ||
                    candidate.designType !== "combined"
                      ? `${candidate.nameKetua} & ${candidate.nameWakil}`
                      : ""}
                  </h3>
                  <div className="bg-gray-100 h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  </div>
                </div>

                {/* Program section with improved styling */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-xs sm:text-sm text-indigo-700 mb-1 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
                      Visi:
                    </h4>
                    <p className="text-gray-700 text-xs sm:text-sm line-clamp-3 hover:line-clamp-none transition-all duration-300">
                      {candidate.visi}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-2 sm:p-3 rounded-lg border border-purple-100">
                    <h4 className="font-medium text-xs sm:text-sm text-purple-700 mb-1 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
                      Misi:
                    </h4>
                    <p className="text-gray-700 text-xs sm:text-sm line-clamp-3 hover:line-clamp-none transition-all duration-300">
                      {candidate.misi}
                    </p>
                  </div>
                </div>

                {/* Action button with enhanced state styles */}
                <button
                  className={`mt-3 sm:mt-5 w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 shadow flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm ${
                    hasVoted
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : timeExpired
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasVoted && !timeExpired) {
                      handleSelectCandidate(candidate);
                    }
                  }}
                  disabled={hasVoted || timeExpired}
                >
                  <span>
                    {hasVoted
                      ? "Sudah Memilih"
                      : timeExpired
                      ? "Waktu Habis"
                      : "Pilih Kandidat"}
                  </span>
                  {hasVoted ? (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : timeExpired ? (
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions Section with Enhanced Design - Responsive */}
        <div className="mt-6 sm:mt-10 bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full transform translate-x-10 sm:translate-x-20 -translate-y-10 sm:-translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 rounded-full transform -translate-x-10 sm:-translate-x-20 translate-y-10 sm:translate-y-20"></div>

          <div className="flex items-center mb-4 sm:mb-6 relative z-10">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 shadow-md">
              <Info className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text">
              Petunjuk Voting
            </h3>
          </div>

          <div className="pl-4 sm:pl-6 relative z-10">
            <ul className="space-y-2 sm:space-y-4">
              <li className="flex items-start text-gray-700">
                <div className="bg-blue-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">
                  Pilih salah satu kandidat dengan mengklik kartu atau tombol
                  "Pilih Kandidat"
                </span>
              </li>
              <li className="flex items-start text-gray-700">
                <div className="bg-indigo-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
                  <span className="text-indigo-600 text-xs font-bold">2</span>
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">
                  Konfirmasi pilihan Anda pada jendela yang muncul
                </span>
              </li>
              <li className="flex items-start text-gray-700">
                <div className="bg-purple-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
                  <span className="text-purple-600 text-xs font-bold">3</span>
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">
                  Setelah konfirmasi, pilihan Anda tidak dapat diubah
                </span>
              </li>
              <li className="flex items-start text-gray-700">
                <div className="bg-pink-100 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shadow-sm">
                  <span className="text-pink-600 text-xs font-bold">4</span>
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">
                  Waktu voting dibatasi 15 menit. Jika waktu habis, Anda tidak
                  bisa memilih kandidat
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 mt-6">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-gray-500">
          &copy; {new Date().getFullYear()} E-Voting Mahasiswa • Sistem
          Pemilihan Berbasis Digital
        </div>
      </footer>

      {/* Improved Confirmation Modal - Responsive */}
      {showConfirmation && selectedCandidate && (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full transform translate-x-10 sm:translate-x-16 -translate-y-10 sm:-translate-y-16"></div>

            <div className="flex justify-between items-center mb-4 sm:mb-5 relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Konfirmasi Pilihan
              </h3>
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="relative z-10">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 border border-gray-100">
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  Anda akan memilih:
                </p>
                <div className="font-medium text-gray-800 flex items-center">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
                  <span>
                    Pasangan #
                    {candidates.findIndex(
                      (c) => c.id === selectedCandidate.id
                    ) + 1}{" "}
                    - {selectedCandidate.nameKetua} &{" "}
                    {selectedCandidate.nameWakil}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Pilihan tidak dapat diubah setelah konfirmasi. Pastikan pilihan
                Anda sudah benar.
              </p>

              <div className="flex space-x-3 sm:space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-2 sm:py-3 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium"
                >
                  Kembali
                </button>
                <button
                  onClick={handleConfirmVote}
                  className="flex-1 py-2 sm:py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-colors text-xs sm:text-sm font-medium"
                >
                  Konfirmasi Pilihan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Voting Berhasil!
            </h3>
            <p className="text-gray-600 mb-4">
              Terima kasih atas partisipasi Anda dalam pemilihan ini.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaVoting;
