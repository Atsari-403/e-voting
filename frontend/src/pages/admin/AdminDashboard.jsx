import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import {
  // Activity,
  Award,
  ArrowUp,
  Users,
  UserCheck,
  CheckSquare,
  XSquare,
} from "lucide-react";
import axios from "axios";

// Card Component
const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="rounded-full p-2 bg-white bg-opacity-50">{icon}</div>
      </div>
    </div>
  );
};

// Top Candidates Component
const TopCandidates = ({ candidates }) => {
  return (
<div className="bg-white rounded-xl shadow-lg p-6">
  <div className="flex items-center text-gray-800 mb-5">
    <Award className="text-amber-300 mr-2" size={22} />
    <h2 className="font-semibold text-xl">Kandidat Teratas</h2>
  </div>

  {/* Daftar kandidat */}
  {candidates && candidates.length > 0 ? (
    <div className="space-y-4">
      {candidates.map((candidate, index) => (
        <div
          key={candidate.id}
          className="flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-700 font-bold rounded-full h-10 w-10 flex items-center justify-center mr-4 shadow-sm">
              {index + 1}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{candidate.name}</p>
              <p className="text-sm text-gray-600">
                {candidate.votes} suara ({parseFloat(candidate.percentage).toFixed(1)}%)
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <ArrowUp
              size={20}
              className="text-green-600 bg-green-200 rounded-full p-1 shadow"
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-sm text-center">Belum ada data kandidat</p>
  )}
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

  useEffect(() => {
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

        // console.log("Formatted Candidates:", formattedCandidates); // Debug log

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
          "Gagal memuat data: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    // Initial fetch
    fetchDashboardData();

    // Set up polling 10 seconds
    const interval = setInterval(() => {
      // console.log("Polling dashboard data...");
      fetchDashboardData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we want this to run once on mount

  // loading state selama proses fetch data
  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  // Tampilkan pesan error jika gagal memuat data
  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 text-red-600 p-4 rounded-lg">
              <p>{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Mahasiswa"
            value={stats.totalMahasiswa.toLocaleString()}
            icon={<Users size={24} className="text-blue-600" />}
            color="bg-blue-400"
          />
          <DashboardCard
            title="Total Kandidat"
            value={stats.totalKandidat.toLocaleString()}
            icon={<UserCheck size={24} className="text-emerald-600" />}
            color="bg-emerald-400"
          />
          <DashboardCard
            title="Sudah Voting"
            value={stats.sudahVoting.toLocaleString()}
            icon={<CheckSquare size={24} className="text-violet-600" />}
            color="bg-violet-400"
          />
          <DashboardCard
            title="Belum Voting"
            value={stats.belumVoting.toLocaleString()}
            icon={<XSquare size={24} className="text-rose-600" />}
            color="bg-rose-400"
          />
        </div>

        {/* Two Column Layout for Activity and Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <RecentActivity activities={activities} /> */}
          <TopCandidates candidates={candidates} />
        </div>
        {lastUpdate && (
          <div className="text-sm text-black mt-2">
            Terakhir diperbarui: {lastUpdate}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
