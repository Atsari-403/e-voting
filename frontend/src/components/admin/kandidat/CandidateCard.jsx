import React from "react";
import { Trash2, User, Award, Target, Eye } from "lucide-react";

const CandidateCard = ({ candidate, onDelete }) => {
  const handleDelete = () => {
    onDelete(candidate.id, `${candidate.nameKetua} & ${candidate.nameWakil}`);
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-white via-white to-blue-50/30 
                    rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 
                    border border-gray-100 hover:border-blue-200/50 overflow-hidden
                    transform hover:-translate-y-1"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-xl" />

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Profile Photos Section */}
          <div className="flex flex-row lg:flex-col justify-center gap-6 items-center lg:items-start">
            {/* Ketua Photo */}
            <div className="relative group/photo">
              <div className="relative">
                {candidate.fotoKetua ? (
                  <img
                    src={`http://localhost:5000${candidate.fotoKetua}`}
                    alt="Foto Ketua"
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover 
                             rounded-2xl ring-4 ring-gradient-to-r from-blue-400 to-indigo-500 
                             ring-offset-2 shadow-lg group-hover/photo:shadow-xl
                             transition-all duration-300 group-hover/photo:scale-105"
                  />
                ) : (
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 
                                bg-gradient-to-br from-gray-100 to-gray-200 
                                rounded-2xl flex items-center justify-center
                                ring-4 ring-gray-300 ring-offset-2 shadow-lg"
                  >
                    <User className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
                  </div>
                )}
                <div
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 
                              text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg
                              border-2 border-white"
                >
                  Ketua
                </div>
              </div>
            </div>

            {/* Wakil Photo */}
            <div className="relative group/photo">
              <div className="relative">
                {candidate.fotoWakil ? (
                  <img
                    src={`http://localhost:5000${candidate.fotoWakil}`}
                    alt="Foto Wakil"
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover 
                             rounded-2xl ring-4 ring-gradient-to-r from-blue-400 to-indigo-500 
                             ring-offset-2 shadow-lg group-hover/photo:shadow-xl
                             transition-all duration-300 group-hover/photo:scale-105"
                  />
                ) : (
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 
                                bg-gradient-to-br from-gray-100 to-gray-200 
                                rounded-2xl flex items-center justify-center
                                ring-4 ring-gray-300 ring-offset-2 shadow-lg"
                  >
                    <User className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
                  </div>
                )}
                <div
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 
                              text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg
                              border-2 border-white"
                >
                  Wakil
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div>
              <h3
                className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                           bg-clip-text text-transparent leading-tight"
              >
                {candidate.nameKetua}
              </h3>
              <div className="flex items-center mt-1">
                <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3" />
                <h4 className="text-lg lg:text-xl font-semibold text-gray-700">
                  {candidate.nameWakil}
                </h4>
              </div>
            </div>

            {/* Vision & Mission Cards */}
            <div className="space-y-4">
              {/* Vision Card */}
              <div
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 
                            border border-green-100 hover:border-green-200 transition-colors duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 
                                rounded-lg flex items-center justify-center shadow-md"
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2">Visi</h4>
                    <p className="text-sm lg:text-base text-green-700 leading-relaxed">
                      {candidate.visi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission Card */}
              <div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 
                            border border-blue-100 hover:border-blue-200 transition-colors duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 
                                rounded-lg flex items-center justify-center shadow-md"
                  >
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800 mb-2">Misi</h4>
                    <p className="text-sm lg:text-base text-blue-700 leading-relaxed">
                      {candidate.misi}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* tombol hapus */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleDelete}
                className="group/btn inline-flex items-center px-4 py-2.5 
                         bg-gradient-to-r from-red-50 to-pink-50 
                         border border-red-200 rounded-xl
                         text-red-600 font-medium text-sm
                         hover:from-red-500 hover:to-pink-500 hover:text-white
                         hover:border-red-500 hover:shadow-lg
                         transform hover:scale-105 transition-all duration-300
                         focus:outline-none focus:ring-4 focus:ring-red-200/50"
              >
                <Trash2 className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                Hapus Kandidat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
