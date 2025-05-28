import React from "react";
import { Crown, Users, TrendingUp } from "lucide-react";

const CandidateList = ({ candidates }) => {
  // Dynamic colors untuk progress bars dan badges
  const getColorScheme = (index) => {
    const colors = [
      {
        bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        progress: "bg-blue-500",
        badge: "bg-blue-100 text-blue-700",
      },
      {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        progress: "bg-orange-500",
        badge: "bg-orange-100 text-orange-700",
      },
      {
        bg: "bg-gradient-to-r from-emerald-500 to-green-600",
        progress: "bg-green-500",
        badge: "bg-green-100 text-green-700",
      },
      {
        bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
        progress: "bg-purple-500",
        badge: "bg-purple-100 text-purple-700",
      },
      {
        bg: "bg-gradient-to-r from-pink-500 to-rose-600",
        progress: "bg-pink-500",
        badge: "bg-pink-100 text-pink-700",
      },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 overflow-hidden lg:col-span-2">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-sm">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="hidden sm:inline">Perolehan Suara Kandidat</span>
            <span className="sm:hidden">Hasil Suara</span>
          </h3>
          <div className="text-sm sm:text-lg text-gray-600 font-semibold flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-gray-800 mr-1">
              {candidates.length}
            </span>
            <span className="hidden sm:inline">Kandidat</span>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-5">
          {candidates.map((candidate, index) => {
            const colorScheme = getColorScheme(index);
            const isLeading = index === 0;

            return (
              <div
                key={index}
                className={`relative rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg border ${
                  isLeading
                    ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-200/50 shadow-md"
                    : "bg-gray-50/50 border-gray-200/50 hover:bg-gray-50"
                }`}
              >
                {/* Leading Badge */}
                {isLeading && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-2.5 shadow-lg">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="flex items-center mb-3">
                    <div
                      className={`h-12 w-12 rounded-xl ${colorScheme.bg} flex items-center justify-center text-white font-bold mr-3 shadow-sm text-lg`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 truncate">
                        {candidate.nameKetua} & {candidate.nameWakil}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium">
                        Kandidat {index + 1}
                      </p>
                    </div>
                    {isLeading && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full ml-2">
                        #1
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-800">
                        {candidate.votes}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        suara
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1.5 ${colorScheme.badge} rounded-lg font-bold text-base`}
                    >
                      {candidate.percentage}%
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between mb-4">
                  {/* Left Section: Candidate Info */}
                  <div className="flex items-center flex-1 min-w-0">
                    <div
                      className={`h-14 w-14 rounded-xl ${colorScheme.bg} flex items-center justify-center text-white font-bold mr-4 shadow-sm text-xl`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {candidate.nameKetua} & {candidate.nameWakil}
                        </h4>
                        {isLeading && (
                          <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
                            Tertinggi
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 font-medium">
                        Kandidat {index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Right Section: Vote Stats */}
                  <div className="text-right ml-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-3xl font-bold text-gray-800">
                          {candidate.votes}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                          suara
                        </p>
                      </div>
                      <div
                        className={`px-4 py-2 ${colorScheme.badge} rounded-xl font-bold text-lg`}
                      >
                        {candidate.percentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${colorScheme.progress} transition-all duration-700 ease-out relative overflow-hidden`}
                      style={{ width: `${candidate.percentage}%` }}
                    >
                      {/* Shimmer effect untuk kandidat terdepan */}
                      {isLeading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="bg-gray-50/50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200/50">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 flex items-center font-medium text-sm sm:text-base">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Total Partisipasi
          </span>
          <span className="font-bold text-gray-800 text-base sm:text-lg">
            {candidates.reduce(
              (total, candidate) => total + candidate.votes,
              0
            )}{" "}
            Suara
          </span>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
