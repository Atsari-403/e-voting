import React from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
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
import { ArrowUp, Activity } from "lucide-react";

// Data kandidat (contoh)
const candidateData = [
  { name: "Ahmad Faisal", votes: 20, percent: 45, trend: "up" },
  { name: "Dina Putri", votes: 15, percent: 32, trend: "up" },
  { name: "Rudi Hermawan", votes: 10, percent: 23, trend: "down" },
];

// Colors untuk pie chart
const COLORS = ["#4ade80", "#60a5fa", "#f87171"];

const HasilVotingPage = () => {
  const totalVotes = candidateData.reduce(
    (sum, candidate) => sum + candidate.votes,
    0
  );

  // Data untuk pie chart
  const pieData = candidateData.map((candidate) => ({
    name: candidate.name,
    value: candidate.votes,
  }));

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
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
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} suara`, "Jumlah"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Voting Statistics - Now next to pie chart */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 mb-2">Total Suara</h3>
                <p className="text-3xl font-semibold">{totalVotes}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 mb-2">Partisipasi</h3>
                <p className="text-3xl font-semibold">84%</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 mb-2">Suara terbanyak</h3>
                <p className="text-3xl font-semibold text-green-500">LAMINE YAMAL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default HasilVotingPage;
