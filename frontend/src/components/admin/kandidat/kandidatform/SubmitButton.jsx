import React from "react";
import { Loader2 } from "lucide-react";

const SubmitButton = ({ loading }) => {
  return (
    <div className="flex justify-end mt-6">
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Menyimpan...
          </>
        ) : (
          "Simpan Kandidat"
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
