import React from "react";
import { Trash2, User, Award, Target, Eye, Users } from "lucide-react";

const CandidateCard = ({ candidate, onDelete }) => {
  const handleDelete = () => {
    onDelete(candidate.id, `${candidate.nameKetua} & ${candidate.nameWakil}`);
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-white via-white to-blue-50/30 
                    rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 
                    border border-gray-100 hover:border-blue-200/50 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/15 via-purple-400/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/15 via-pink-400/10 to-transparent rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-xl" />

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Ketua and Wakil */}
          <div className="flex flex-row lg:flex-col justify-center gap-8 items-center lg:items-start">
            {/* Ketua Photo */}
            <div className="relative group/photo">
              <div className="relative">
                {/* Animated background ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full p-1">
                  <div className="bg-white rounded-full w-full h-full"></div>
                </div>

                {candidate.fotoKetua ? (
                  <img
                    src={`http://localhost:5000${candidate.fotoKetua}`}
                    alt="Foto Ketua"
                    className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover 
                             rounded-full ring-4 ring-white ring-offset-4 ring-offset-transparent
                             shadow-xl transition-all duration-300"
                  />
                ) : (
                  <div
                    className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 
                                bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 
                                rounded-full flex items-center justify-center
                                ring-4 ring-white ring-offset-4 ring-offset-transparent shadow-xl
                                transition-all duration-300"
                  >
                    <User className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" />
                  </div>
                )}

                {/* Enhanced badge */}
                <div
                  className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 
                              text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg
                              border-3 border-white"
                >
                  <Award className="w-3 h-3 inline mr-1" />
                  Ketua
                </div>
              </div>
            </div>

            {/* Connector line for visual flow */}
            <div className="hidden lg:block w-0.5 h-8 bg-gradient-to-b from-blue-300 to-indigo-400 rounded-full mx-auto"></div>
            <div className="lg:hidden w-8 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full"></div>

            {/* Wakil Photo with enhanced circular design */}
            <div className="relative group/photo">
              <div className="relative">
                {/* Animated background ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-full p-1">
                  <div className="bg-white rounded-full w-full h-full"></div>
                </div>

                {candidate.fotoWakil ? (
                  <img
                    src={`http://localhost:5000${candidate.fotoWakil}`}
                    alt="Foto Wakil"
                    className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover 
                             rounded-full ring-4 ring-white ring-offset-4 ring-offset-transparent
                             shadow-xl transition-all duration-300"
                  />
                ) : (
                  <div
                    className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 
                                bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 
                                rounded-full flex items-center justify-center
                                ring-4 ring-white ring-offset-4 ring-offset-transparent shadow-xl
                                transition-all duration-300"
                  >
                    <User className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" />
                  </div>
                )}

                {/* Enhanced badge */}
                <div
                  className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 
                              text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg
                              border-3 border-white"
                >
                  <Users className="w-3 h-3 inline mr-1" />
                  Wakil
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="flex-1 space-y-6">
            {/* Enhanced Header with better typography */}
            <div className="text-center lg:text-left">
              <h3
                className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 
                           bg-clip-text text-transparent leading-tight mb-1"
              >
                {candidate.nameKetua}
              </h3>

              <div className="flex items-center justify-center lg:justify-start">
                <div className="h-0.5 w-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mr-2" />
                <h4 className="text-lg lg:text-xl font-semibold text-gray-600 italic">
                  & {candidate.nameWakil}
                </h4>
                <div className="h-0.5 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full ml-2" />
              </div>
            </div>

            {/* Enhanced Vision & Mission Cards */}
            <div className="space-y-5">
              {/* Enhanced Vision Card */}
              <div
                className="group bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl p-5 
                            border border-emerald-200 hover:border-emerald-400 hover:shadow-lg 
                            transition-all duration-300 relative overflow-hidden"
              >
                {/* Card background pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-xl" />

                <div className="flex items-start space-x-4 relative">
                  <div
                    className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 
                                rounded-xl flex items-center justify-center shadow-lg
                                transition-all duration-300"
                  >
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-emerald-800 mb-3 text-lg">
                      Visi
                    </h4>
                    <p className="text-base text-emerald-700 leading-relaxed group-hover:text-emerald-800 transition-colors duration-300">
                      {candidate.visi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Mission Card */}
              <div
                className="group bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 
                            border border-blue-200 hover:border-blue-400 hover:shadow-lg 
                            transition-all duration-300 relative overflow-hidden"
              >
                {/* Card background pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-xl" />

                <div className="flex items-start space-x-4 relative">
                  <div
                    className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 
                                rounded-xl flex items-center justify-center shadow-lg
                                transition-all duration-300"
                  >
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-800 mb-3 text-lg">
                      Misi
                    </h4>
                    <p className="text-base text-blue-700 leading-relaxed group-hover:text-blue-800 transition-colors duration-300">
                      {candidate.misi}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Delete Button */}
            <div className="flex justify-center lg:justify-end pt-4">
              <button
                onClick={handleDelete}
                className="group/btn inline-flex items-center px-6 py-3 
                         bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 
                         border-2 border-red-200 rounded-2xl
                         text-red-600 font-semibold text-sm
                         hover:from-red-500 hover:via-pink-500 hover:to-rose-500 hover:text-white
                         hover:border-red-500 hover:shadow-lg
                         transform hover:scale-105 transition-all duration-300
                         focus:outline-none focus:ring-4 focus:ring-red-200/50"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                <span>Hapus Kandidat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
