import React from "react";
import { Users } from "lucide-react";

const CandidateList = ({ candidates }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
          <Users className="w-5 h-5 text-yellow-600" />
        </div>
        Perolehan Suara Kandidat
      </h3>
      <div className="space-y-4">
        {candidates.map((candidate, index) => (
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
                  <p className="text-sm text-gray-500">Kandidat {index + 1}</p>
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
  );
};

export default CandidateList;
