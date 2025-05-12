import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import { Activity, ArrowUp, Users, UserCheck, UserX } from "lucide-react";
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

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-medium text-lg mb-4">Aktivitas Terbaru</h2>
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <Activity size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Belum ada aktivitas terbaru</p>
      )}
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
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-gray-500">
                    {candidate.votes} suara
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm ${
                    candidate.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {candidate.percentage}%
                </span>
                {candidate.trend === "up" && (
                  <ArrowUp size={16} className="ml-1 text-green-500" />
                )}
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

  useEffect(() => {
    // Fungsi untuk mengambil data dashboard
    const fetchDashboardData = async () => {
      try {
        const mahasiswaResponse = await axios.get(
          "http://localhost:5000/api/users",
          {
            withCredentials: true,
          }
        );

        const mahasiswaList = mahasiswaResponse.data.filter(
          (user) => user?.nim && user.nim !== "mahasiswa"
        );

        const totalMahasiswa = mahasiswaList.length;

        setStats({
          totalMahasiswa: totalMahasiswa,
          totalKandidat: 0,
          sudahVoting: 84,
          partisipasi: "37,5%",
        });

        setActivities([
          {
            id: 1,
            user: "Jefri Setiawan",
            action: "melakukan voting",
            time: "5 menit yang lalu",
          },
          {
            id: 2,
            user: "Admin",
            action: "menambahkan kandidat baru",
            time: "1 jam yang lalu",
          },
          {
            id: 3,
            user: "Siti Nurhayati",
            action: "melakukan voting",
            time: "2 jam yang lalu",
          },
          {
            id: 4,
            user: "Admin",
            action: "mengubah pengaturan voting",
            time: "1 hari yang lalu",
          },
        ]);

        setCandidates([
          {
            id: 1,
            name: "Ahmad Faisal",
            votes: 20,
            percentage: 45,
            trend: "up",
          },
          {
            id: 2,
            name: "Dina Putri",
            votes: 15,
            percentage: 32,
            trend: "up",
          },
          {
            id: 3,
            name: "Rudi Hermawan",
            votes: 10,
            percentage: 23,
            trend: "down",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          "Gagal memuat data: " +
            (error.response?.data?.message || error.message)
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

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
            value={stats.totalKandidat}
            icon={<UserCheck size={24} className="text-green-500" />}
            color="bg-green-100"
          />
          <DashboardCard
            title="Sudah Voting"
            value={stats.sudahVoting.toLocaleString()}
            icon={<UserCheck size={24} className="text-purple-500" />}
            color="bg-purple-100"
          />
          <DashboardCard
            title="Belum Voting"
            value={stats.partisipasi}
            icon={<UserX size={24} className="text-orange-500" />}
            color="bg-orange-100"
          />
        </div>

        {/* Two Column Layout for Activity and Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={activities} />
          <TopCandidates candidates={candidates} />
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
