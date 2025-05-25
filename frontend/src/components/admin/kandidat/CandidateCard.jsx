import React from "react";
import { Trash2, User, Award } from "lucide-react";

const CandidateCard = ({ candidate, onDelete }) => {
  const handleDelete = () => {
    // onDelete tanpa konfirmasi window.confirm
    // Konfirmasi akan ditangani oleh SweetAlert di useCandidates hook
    onDelete(candidate.id, `${candidate.nameKetua} & ${candidate.nameWakil}`);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Foto Profil Kandidat */}
        <div className="flex flex-row justify-center md:flex-col gap-4 items-center">
          <div className="relative">
            {candidate.fotoKetua ? (
              <img
                src={`http://localhost:5000${candidate.fotoKetua}`}
                alt="Foto Ketua"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-full ring-4 ring-blue-100"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
            <span className="absolute -bottom-1 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              Ketua
            </span>
          </div>

          <div className="relative">
            {candidate.fotoWakil ? (
              <img
                src={`http://localhost:5000${candidate.fotoWakil}`}
                alt="Foto Wakil"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-full ring-4 ring-blue-100"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
            <span className="absolute -bottom-1 right-0 bg-green-400 text-white text-xs px-2 py-1 rounded-full">
              Wakil
            </span>
          </div>
        </div>

        {/* Informasi Kandidat */}
        <div className="flex-1 mt-4 md:mt-0">
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-auto">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {candidate.nameKetua} & {candidate.nameWakil}
              </h3>
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                <div>
                  <h4 className="flex items-center text-gray-700 font-semibold">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    Visi
                  </h4>
                  <p className="mt-1 text-sm sm:text-base text-gray-600 pl-6 sm:pl-7">
                    {candidate.visi}
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center text-gray-700 font-semibold">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    Misi
                  </h4>
                  <p className="mt-1 text-sm sm:text-base text-gray-600 pl-6 sm:pl-7">
                    {candidate.misi}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Kandidat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
