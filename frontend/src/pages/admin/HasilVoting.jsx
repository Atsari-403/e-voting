import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUp, Activity, Loader, Award, Clock, Users } from "lucide-react";

// Colors untuk pie chart - menggunakan warna yang lebih cerah seperti di dashboard
const COLORS = ["#4f46e5", "#f59e0b", "#10b981"];

const HasilVotingPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteData, setVoteData] = useState({
    candidates: [],
    totalVoters: 0,
    lastUpdated: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoteResults = async () => {
      try {
        setLoading(true);
        // console.log("Fetching vote results...");

        const response = await axios.get(
          "http://localhost:5000/api/users/vote-results",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("Response:", response.data);
        setVoteData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error detail:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          path: error.response?.config?.url,
        });

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }
        setError("Gagal memuat data hasil voting");
      } finally {
        setLoading(false);
      }
    };

    fetchVoteResults();
    const interval = setInterval(fetchVoteResults, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Data untuk pie chart
  const pieData = voteData.candidates.map((candidate) => ({
    name: `${candidate.nameKetua}`,
    value: candidate.votes || 0,
    percentage: candidate.percentage || 0,
  }));

  // useEffect(() => {
  //   console.log("Pie Data:", pieData);
  // }, [pieData]);

  // useEffect(() => {
  //   console.log("Vote Data:", voteData);
  //   console.log("Pie Data:", pieData);
  //   console.log("Total Voters:", voteData.totalVoters);
  // }, [voteData, pieData]);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
            <span className="text-gray-700 font-medium">
              Memuat data hasil voting...
            </span>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (voteData.candidates.length === 0) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col items-center">
              <Activity className="h-12 w-12 text-gray-400 mb-4" />
              <div className="text-xl font-medium text-gray-700">
                Tidak ada data kandidat tersedia
              </div>
              <p className="text-gray-500 mt-2">
                Silakan tambahkan kandidat terlebih dahulu
              </p>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Terakhir update:{" "}
                {new Date(voteData.lastUpdated).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-500 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-5 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-600 rounded-md p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-100 truncate">
                        Total Suara Masuk
                      </dt>
                      <dd>
                        <div className="text-3xl font-bold text-white">
                          {voteData.totalVoters}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {voteData.candidates.length > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-5 sm:px-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-600 rounded-md p-3">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-green-100 truncate">
                          Suara Terbanyak
                        </dt>
                        <dd>
                          <div className="text-2xl font-bold text-white">
                            {voteData.candidates[0].nameKetua}
                          </div>
                          <div className="text-sm text-green-100">
                            {voteData.candidates[0].votes} suara (
                            {voteData.candidates[0].percentage}%)
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-5 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-600 rounded-md p-3">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-purple-100 truncate">
                        Total Kandidat
                      </dt>
                      <dd>
                        <div className="text-3xl font-bold text-white">
                          {voteData.candidates.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </div>
                Distribusi Suara
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${props.payload.name}: ${value} suara (${props.payload.percentage}%)`,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Candidate List */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Perolehan Suara Kandidat
              </h3>
              <div className="space-y-4">
                {voteData.candidates.map((candidate, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {candidate.nameKetua} & {candidate.nameWakil}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Kandidat {index + 1}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {candidate.votes}
                        </p>
                        <p className="text-sm text-gray-500">
                          Suara ({candidate.percentage}%)
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          index === 0
                            ? "bg-blue-600"
                            : index === 1
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${candidate.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default HasilVotingPage;
