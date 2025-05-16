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
import { ArrowUp, Activity, Loader } from "lucide-react";

// Colors untuk pie chart
const COLORS = ["#4ade80", "#60a5fa", "#f87171"];

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
        console.log("Fetching vote results...");

        const response = await axios.get(
          "http://localhost:5000/api/users/vote-results",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response:", response.data);
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
    name: `${candidate.nameKetua}`, // Mempersingkat label
    value: candidate.votes || 0, // Memastikan nilai tidak undefined
    percentage: candidate.percentage || 0, // Memastikan nilai tidak undefined
  }));

  useEffect(() => {
    console.log("Pie Data:", pieData);
  }, [pieData]);

  useEffect(() => {
    console.log("Vote Data:", voteData);
    console.log("Pie Data:", pieData);
    console.log("Total Voters:", voteData.totalVoters);
  }, [voteData, pieData]);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader className="animate-spin h-5 w-5 text-blue-500" />
            <span className="text-gray-600">Memuat data...</span>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (voteData.candidates.length === 0) {
    return (
      <AdminDashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Tidak ada data kandidat tersedia</div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Distribusi Suara
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} suara`]}
                    labelFormatter={(name) => `Kandidat: ${name}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Voting Statistics */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 mb-2">Total Suara Masuk</h3>
                <p className="text-3xl font-semibold">{voteData.totalVoters}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 mb-2">Terakhir Update</h3>
                <p className="text-lg font-medium">
                  {new Date(voteData.lastUpdated).toLocaleString("id-ID")}
                </p>
              </div>

              {voteData.candidates.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 mb-2">Suara Terbanyak</h3>
                  <p className="text-3xl font-semibold text-green-500">
                    {voteData.candidates[0].nameKetua} &{" "}
                    {voteData.candidates[0].nameWakil}
                  </p>
                  <p className="text-lg text-gray-600">
                    {voteData.candidates[0].votes} suara (
                    {voteData.candidates[0].percentage}%)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default HasilVotingPage;
