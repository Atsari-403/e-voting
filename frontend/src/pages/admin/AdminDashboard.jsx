import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import {
  // Award,
  // ArrowUp,
  Users,
  UserCheck,
  CheckSquare,
  XSquare,
  RefreshCw,
  BarChart3,
  // Info,
  Loader2,
} from "lucide-react";
import axios from "axios";

// Card Component
const DashboardCard = ({ title, value, icon, color, bgColor, textColor }) => {
  return (
    <div
      className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            className={`text-sm font-semibold ${textColor} opacity-90 tracking-wide`}
          >
            {title}
          </h3>
          <p className={`text-3xl font-bold mt-2 ${textColor} drop-shadow-sm`}>
            {value}
          </p>
        </div>
        <div
          className={`rounded-2xl p-4 bg-white bg-opacity-20 backdrop-blur-sm`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// Voting Stats Component
const VotingStats = ({ sudahVoting, totalMahasiswa }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const percentage =
    totalMahasiswa > 0 ? (sudahVoting / totalMahasiswa) * 100 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center text-gray-800">
          <div className="p-2 bg-purple-100 rounded-xl mr-3">
            <BarChart3 className="text-purple-600" size={22} />
          </div>
          <h2 className="font-bold text-xl">Statistik Partisipasi</h2>
        </div>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
          Live Stats
        </span>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          {animatedPercentage.toFixed(1)}%
        </h3>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${animatedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    totalKandidat: 0,
    sudahVoting: 0,
    partisipasi: "0%",
  });

  const [activities, setActivities] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [mahasiswaResponse, voteResultsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/users", {
          withCredentials: true,
        }),
        axios.get("http://localhost:5000/api/users/vote-results", {
          withCredentials: true,
        }),
      ]);

      // Filter mahasiswa
      const mahasiswaList = mahasiswaResponse.data.filter(
        (user) => user?.nim && user.nim !== "admin"
      );

      const totalMahasiswa = mahasiswaList.length;
      const totalVotes = mahasiswaList.filter(
        (m) => m.hasVoted === true
      ).length;

      // Format kandidat data dengan data dari vote-results
      const formattedCandidates = voteResultsResponse.data.candidates.map(
        (kandidat) => ({
          id: kandidat.id,
          name: `${kandidat.nameKetua} & ${kandidat.nameWakil}`,
          votes: kandidat.votes || 0,
          percentage: kandidat.percentage,
        })
      );

      // Update stats
      setStats({
        totalMahasiswa,
        totalKandidat: formattedCandidates.length,
        sudahVoting: totalVotes,
        belumVoting: totalMahasiswa - totalVotes,
      });

      setCandidates(formattedCandidates);
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(
        "Gagal memuat data: " + (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDashboardData();

    // Set up polling 10 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array since want this to run once on mount

  // Enhanced loading state
  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-20 w-20 text-blue-600 mx-auto" />
            <p className="mt-6 text-gray-600 font-semibold text-lg">
              Memuat dashboard...
            </p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-gradient-to-br from-red-50 to-red-100 text-red-700 p-8 rounded-2xl border border-red-200 mb-6 shadow-lg">
              <p className="font-semibold text-lg">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold transform hover:-translate-y-1"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Mahasiswa"
            value={stats.totalMahasiswa.toLocaleString()}
            icon={<Users size={28} className="text-blue-700" />}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
            textColor="text-white"
          />
          <DashboardCard
            title="Total Kandidat"
            value={stats.totalKandidat.toLocaleString()}
            icon={<UserCheck size={28} className="text-emerald-700" />}
            color="text-emerald-600"
            bgColor="bg-gradient-to-br from-emerald-400 to-emerald-500"
            textColor="text-white"
          />
          <DashboardCard
            title="Sudah Voting"
            value={stats.sudahVoting.toLocaleString()}
            icon={<CheckSquare size={28} className="text-violet-700" />}
            color="text-violet-600"
            bgColor="bg-gradient-to-br from-violet-400 to-violet-500"
            textColor="text-white"
          />
          <DashboardCard
            title="Belum Voting"
            value={stats.belumVoting.toLocaleString()}
            icon={<XSquare size={28} className="text-rose-700" />}
            color="text-rose-600"
            bgColor="bg-gradient-to-br from-rose-400 to-rose-500"
            textColor="text-white"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VotingStats
            sudahVoting={stats.sudahVoting}
            totalMahasiswa={stats.totalMahasiswa}
          />
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="inline-flex items-center text-sm text-amber-800 bg-gradient-to-r from-amber-200 to-yellow-200 px-4 py-3 rounded-xl shadow-lg border border-amber-300">
            <RefreshCw size={16} className="mr-2 text-amber-600" />
            Terakhir diperbarui: {lastUpdate}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
