import React from "react";
import { Users, Award, Activity } from "lucide-react";

const VoteStats = ({ voteData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Suara Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white/20 rounded-lg p-2.5">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-100 uppercase tracking-wide">
                Total Suara Masuk
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {voteData.totalVoters}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suara Terbanyak */}
      {voteData.candidates.length > 0 && (
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="px-4 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white/20 rounded-lg p-2.5">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-xs font-medium text-green-100 uppercase tracking-wide">
                  Suara Terbanyak
                </p>
                <p className="text-lg font-bold text-white mt-1 truncate">
                  {voteData.candidates[0].nameKetua}
                </p>
                <p className="text-xs text-green-100 mt-0.5">
                  {voteData.candidates[0].votes} suara (
                  {voteData.candidates[0].percentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Kandidat Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white/20 rounded-lg p-2.5">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-xs font-medium text-purple-100 uppercase tracking-wide">
                Total Kandidat
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {voteData.candidates.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteStats;
