import React from "react";
import { Users, Award, Activity } from "lucide-react";

const VoteStats = ({ voteData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Suara Card */}
      <div className="bg-blue-500 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white rounded-lg p-3">
              <Users className="h-6 w-6 text-blue-600" />
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

      {/* Suara Terbanyak */}
      {voteData.candidates.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white rounded-lg p-3">
                <Award className="h-6 w-6 text-green-600" />
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
                    {/* <div className="text-sm text-green-100">
                      {voteData.candidates[0].votes} suara (
                      {voteData.candidates[0].percentage}%)
                    </div> */}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Kandidat Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white rounded-md p-3">
              <Activity className="h-6 w-6 text-purple-600" />
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
  );
};

export default VoteStats;
