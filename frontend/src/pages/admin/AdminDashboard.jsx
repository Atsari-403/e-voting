import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import {
  Award,
  ArrowUp,
  Users,
  UserCheck,
  CheckSquare,
  XSquare,
  RefreshCw,
  BarChart3,
  Info,
} from "lucide-react";
import axios from "axios";

// Card Component yang dipercantik
const DashboardCard = ({ title, value, icon, color, bgColor, textColor }) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-medium ${textColor} opacity-90`}>
            {title}
          </h3>
          <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color} bg-opacity-20`}>{icon}</div>
      </div>
    </div>
  );
};

// Top Candidates Component dipercantik
// const TopCandidates = ({ candidates }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//       <div className="flex items-center justify-between mb-5">
//         <div className="flex items-center text-gray-800">
//           <Award className="text-amber-500 mr-2" size={22} />
//           <h2 className="font-bold text-xl">Kandidat Teratas</h2>
//         </div>
//         <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
//           Real-time
//         </span>
//       </div>

//       {/* Daftar kandidat */}
//       {candidates && candidates.length > 0 ? (
//         <div className="space-y-4">
//           {candidates.map((candidate, index) => (
//             <div
//               key={candidate.id}
//               className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-300 border border-gray-100"
//             >
//               <div className="flex items-center">
//                 <div
//                   className={`
//                   ${
//                     index === 0
//                       ? "bg-amber-100 text-amber-700"
//                       : index === 1
//                       ? "bg-gray-200 text-gray-700"
//                       : index === 2
//                       ? "bg-orange-100 text-orange-700"
//                       : "bg-blue-100 text-blue-700"
//                   } 
//                   font-bold rounded-full h-12 w-12 flex items-center justify-center mr-4 shadow-sm`}
//                 >
//                   {index + 1}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {candidate.name}
//                   </p>
//                   <div className="flex items-center mt-1">
//                     <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
//                       <div
//                         className="bg-blue-600 h-2 rounded-full"
//                         style={{
//                           width: `${parseFloat(candidate.percentage)}%`,
//                         }}
//                       ></div>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       {candidate.votes} suara (
//                       {parseFloat(candidate.percentage).toFixed(1)}%)
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <ArrowUp
//                   size={20}
//                   className={`${
//                     index === 0
//                       ? "text-green-600 bg-green-100"
//                       : "text-gray-600 bg-gray-100"
//                   } rounded-full p-1 shadow`}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-8">
//           <Info size={40} className="text-gray-300 mb-3" />
//           <p className="text-gray-500 text-center">
//             Belum ada data kandidat tersedia
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// Komponen baru untuk statistik voting
const VotingStats = ({ sudahVoting, totalMahasiswa }) => {
  const percentage =
    totalMahasiswa > 0 ? (sudahVoting / totalMahasiswa) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center text-gray-800">
          <BarChart3 className="text-purple-500 mr-2" size={22} />
          <h2 className="font-semibold text-xl">Statistik Partisipasi</h2>
        </div>
        {/* <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          Live Stats
        </span> */}
      </div>

      <div className="text-center mb-4">
        <h3 className="text-3xl font-bold text-purple-700">
          {percentage.toFixed(1)}%
        </h3>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="bg-purple-600 h-4 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-xl font-bold text-green-700">{sudahVoting}</p>
          <p className="text-sm text-gray-600">Sudah Voting</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-xl font-bold text-red-700">
            {totalMahasiswa - sudahVoting}
          </p>
          <p className="text-sm text-gray-600">Belum Voting</p>
        </div>
      </div> */}
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
  // const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    // setIsRefreshing(true);
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
    } finally {
      // setIsRefreshing(false);
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
  }, []); // Empty dependency array since we want this to run once on mount

  // loading state selama proses fetch data
  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Memuat dashboard...
            </p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  // Tpesan error jika gagal memuat data
  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 mb-4">
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
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
        {/* Header dengan tombol refresh */}
        {/* <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
        </div> */}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Mahasiswa"
            value={stats.totalMahasiswa.toLocaleString()}
            icon={<Users size={24} className="text-blue-60" />}
            color="text-blue-600"
            bgColor="bg-blue-200"
            textColor="text-blue-800"
          />
          <DashboardCard
            title="Total Kandidat"
            value={stats.totalKandidat.toLocaleString()}
            icon={<UserCheck size={24} className="text-emerald-600" />}
            color="text-emerald-600"
            bgColor="bg-emerald-200"
            textColor="text-emerald-800"
          />
          <DashboardCard
            title="Sudah Voting"
            value={stats.sudahVoting.toLocaleString()}
            icon={<CheckSquare size={24} className="text-violet-600" />}
            color="text-violet-600"
            bgColor="bg-violet-200"
            textColor="text-violet-800"
          />
          <DashboardCard
            title="Belum Voting"
            value={stats.belumVoting.toLocaleString()}
            icon={<XSquare size={24} className="text-rose-600" />}
            color="text-rose-600"
            bgColor="bg-rose-200"
            textColor="text-rose-800"
          />
        </div>

        {/* Two Column Layout for Voting Stats and Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VotingStats
            sudahVoting={stats.sudahVoting}
            totalMahasiswa={stats.totalMahasiswa}
          />
          {/* <TopCandidates candidates={candidates} /> */}
        </div>

        {lastUpdate && (
          <div className="flex items-center justify-start text-sm text-gray-500 mt-2">
            {/* <RefreshCw size={14} className="mr-1" /> */}
            Terakhir diperbarui: {lastUpdate}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
