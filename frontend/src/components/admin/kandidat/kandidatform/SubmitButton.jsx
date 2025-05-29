import React from "react";
import { Loader2, Save } from "lucide-react";

const SubmitButton = ({ loading }) => {
  return (
    <div className="flex justify-end mt-6">
      <button
        type="submit"
        disabled={loading}
        className={`
          relative px-6 py-3 rounded-xl text-white font-semibold 
          flex items-center gap-2 text-sm sm:text-base
          transition-all duration-300 ease-in-out
          transform hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
          min-w-[160px] justify-center
          ${
            loading
              ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          }
        `}
      >
        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            <span>Menyimpan...</span>
          </div>
        )}

        {/* Normal State */}
        {!loading && (
          <>
            <Save className="h-5 w-5" />
            <span>Simpan Kandidat</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
