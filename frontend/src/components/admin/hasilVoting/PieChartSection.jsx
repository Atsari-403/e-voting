import React from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981"];

const PieChartSection = ({ candidates }) => {
  // Data untuk pie chart
  const pieData = candidates.map((candidate) => ({
    name: `${candidate.nameKetua}`,
    value: candidate.votes || 0,
    percentage: candidate.percentage || 0,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
          <PieChartIcon className="h-5 w-5 text-indigo-600" />
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
  );
};

export default PieChartSection;
