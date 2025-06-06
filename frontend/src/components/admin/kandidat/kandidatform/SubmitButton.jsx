import React from "react";
import { Loader2, Save } from "lucide-react";

const SubmitButton = ({ loading }) => {
  return (
    <div className="flex justify-center sm:justify-end mt-4 sm:mt-6 px-2 sm:px-0">
      <button
        type="submit"
        disabled={loading}
        className={`
          relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-semibold 
          flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base
          transition-all duration-300 ease-in-out
          transform hover:scale-[1.02] sm:hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
          min-w-[140px] sm:min-w-[160px] justify-center
          min-h-[44px] touch-manipulation
          w-full sm:w-auto max-w-[280px]
          ${
            loading
              ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200/50"
          }
        `}
      >
        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
            <Loader2 className="animate-spin mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              <span className="block sm:hidden">Menyimpan...</span>
            </span>
          </div>
        )}

        {/* Normal State */}
        {!loading && (
          <>
            <Save className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              <span className="block sm:hidden">Simpan</span>
              <span className="hidden sm:block">Simpan Kandidat</span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
