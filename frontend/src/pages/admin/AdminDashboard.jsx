import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import {
  Activity,
  ArrowUp,
  Users,
  UserCheck,
  CheckSquare,
  XSquare,
} from "lucide-react";
import axios from "axios"; // Pastikan axios sudah diimport

// Card Component
const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`rounded-full p-2 ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

// Top Candidates Component
const TopCandidates = ({ candidates }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-medium text-lg mb-4">Kandidat Teratas</h2>
      {candidates.length > 0 ? (
        <div className="space-y-4">
          {candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-gray-500">
                    {candidate.votes} suara ({candidate.percentage}%)
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <ArrowUp size={16} className="ml-1 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Belum ada data kandidat</p>
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
        const [mahasiswaResponse, kandidatResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/users", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/candidates", {
            withCredentials: true,
          }),
        ]);

        // Filter mahasiswa (exclude admin)
        const mahasiswaList = mahasiswaResponse.data.filter(
          (user) => user?.nim && user.nim !== "admin"
        );

        const totalMahasiswa = mahasiswaList.length;
        const kandidatList = kandidatResponse.data;
        const totalVotes = mahasiswaList.filter(
          (m) => m.hasVoted === true
        ).length;

        // console.log("Debug voting data:", {
        //   totalMahasiswa,
        //   totalVotes,
        //   kandidatList: kandidatList.map((k) => ({
        //     id: k.id,
        //     name: `${k.nameKetua} & ${k.nameWakil}`,
        //     votes: k.jumlah_suara || 0,
        //   })),
        // });

        // Format kandidat data dengan perhitungan suara yang tepat
        const formattedCandidates = kandidatList
          .map((kandidat) => ({
            id: kandidat.id,
            name: `${kandidat.nameKetua} & ${kandidat.nameWakil}`,
            votes: kandidat.jumlah_suara || 0,
            percentage:
              totalVotes > 0
                ? (((kandidat.jumlah_suara || 0) / totalVotes) * 100).toFixed(1)
                : "0.0",
            trend: "up",
          }))
          // Sort kandidat berdasarkan jumlah suara (descending)
          .sort((a, b) => b.votes - a.votes);

        // Update stats
        setStats({
          totalMahasiswa,
          totalKandidat: kandidatList.length,
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

    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we want this to run once on mount

  // Tampilkan loading state selama proses fetch data
  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
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
            icon={<Users size={24} className="text-blue-500" />}
            color="bg-blue-100"
          />
          <DashboardCard
            title="Total Kandidat"
            value={stats.totalKandidat.toLocaleString()}
            icon={<UserCheck size={24} className="text-green-500" />}
            color="bg-green-100"
          />
          <DashboardCard
            title="Sudah Voting"
            value={stats.sudahVoting.toLocaleString()}
            icon={<CheckSquare size={24} className="text-purple-500" />}
            color="bg-purple-100"
          />
          <DashboardCard
            title="Belum Voting"
            value={stats.belumVoting.toLocaleString()}
            icon={<XSquare size={24} className="text-orange-500" />}
            color="bg-orange-100"
          />
        </div>

        {/* Two Column Layout for Activity and Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <RecentActivity activities={activities} /> */}
          <TopCandidates candidates={candidates} />
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-500 mt-2">
            Terakhir diperbarui: {lastUpdate}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
