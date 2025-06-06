import React from 'react';
import { ChevronRight, Star, CheckCircle, Check, X } from 'lucide-react';

const CandidateCard = ({
  candidate,
  index,
  hasVoted,
  timeExpired,
  onSelectCandidate,
  formatImagePath,
}) => {
  const canVote = !hasVoted && !timeExpired;

  const handleSelect = () => {
    if (canVote) {
      onSelectCandidate(candidate);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent card's onClick from firing if button is clicked
    if (canVote) {
      onSelectCandidate(candidate);
    }
  };

  return (
    <div
      key={candidate.id} // key is used by React, not needed as prop for the component itself
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 transform ${
        canVote ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''
      }`}
      onClick={handleSelect}
    >
      {/* Badge penunjuk nomor pasangan */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
        <div className="bg-white shadow-md rounded-full px-2 sm:px-3 py-1 flex items-center space-x-1">
          <Star className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-gray-800">
            Pasangan #{index + 1}
          </span>
        </div>
      </div>

      {/* Pasangan Foto Kandidat */}
      {candidate.designType === 'combined' ? (
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative h-40 sm:h-52">
          <img
            src={
              formatImagePath(candidate.fotoPamflet) ||
              '/placeholder-candidate.png'
            }
            alt={`Pasangan ${candidate.nameKetua} & ${candidate.nameWakil}`}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src = '/placeholder-candidate.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
            <h3 className="font-bold text-sm sm:text-lg">
              {candidate.nameKetua} & {candidate.nameWakil}
            </h3>
          </div>
        </div>
      ) : (
        <div className="flex h-40 sm:h-52 relative">
          <div className="w-1/2 bg-gray-100 relative">
            <img
              src={
                formatImagePath(candidate.fotoKetua) ||
                '/placeholder-ketua.png'
              }
              alt={`Foto ${candidate.nameKetua}`}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src = '/placeholder-ketua.png';
              }}
            />
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white xs px-2 py-1 rounded-bl-md font-medium text-xs">
              Ketua
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
              <h4 className="font-medium text-xs sm:text-sm">
                {candidate.nameKetua}
              </h4>
            </div>
          </div>
          <div className="w-1/2 bg-gray-100 relative">
            <img
              src={
                formatImagePath(candidate.fotoWakil) ||
                '/placeholder-wakil.png'
              }
              alt={`Foto ${candidate.nameWakil}`}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src = '/placeholder-wakil.png';
              }}
            />
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-500 text-white px-2 py-1 rounded-bl-md font-medium text-xs">
              Wakil
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
              <h4 className="font-medium text-xs sm:text-sm">
                {candidate.nameWakil}
              </h4>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 sm:p-5">
        <div className="flex justify-between items-center mb-3 sm:mb-5">
          <h3 className="font-bold text-sm sm:text-lg text-gray-800">
            {!candidate.designType || candidate.designType !== 'combined'
              ? `${candidate.nameKetua} & ${candidate.nameWakil}`
              : ''}
          </h3>
          <div className="bg-gray-100 h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </div>
        </div>

        {/* Program section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-100">
            <h4 className="font-medium text-xs sm:text-sm text-indigo-700 mb-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
              Visi:
            </h4>
            <p className="text-gray-700 text-xs sm:text-sm line-clamp-3 hover:line-clamp-none transition-all duration-300">
              {candidate.visi}
            </p>
          </div>
          <div className="bg-purple-50 p-2 sm:p-3 rounded-lg border border-purple-100">
            <h4 className="font-medium text-xs sm:text-sm text-purple-700 mb-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
              Misi:
            </h4>
            <p className="text-gray-700 text-xs sm:text-sm line-clamp-3 hover:line-clamp-none transition-all duration-300">
              {candidate.misi}
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          className={`mt-3 sm:mt-5 w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 shadow flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm ${
            hasVoted
              ? 'bg-green-100 text-green-700 border border-green-200'
              : timeExpired
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
          }`}
          onClick={handleButtonClick}
          disabled={!canVote}
        >
          <span>
            {hasVoted
              ? 'Sudah Memilih'
              : timeExpired
              ? 'Waktu Habis'
              : 'Pilih Kandidat'}
          </span>
          {hasVoted ? (
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : timeExpired ? (
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
