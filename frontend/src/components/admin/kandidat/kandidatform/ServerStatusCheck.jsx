import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

// Fungsi untuk memeriksa koneksi server
const checkServerConnection = async () => {
  try {
    await axios.get("http://localhost:5000/api/candidates", {
      timeout: 3000,
    });
    return true;
  } catch (error) {
    console.error("Server tidak dapat dijangkau:", error);
    return false;
  }
};

const ServerStatusCheck = ({ onStatusChange }) => {
  const [serverStatus, setServerStatus] = useState("checking");

  useEffect(() => {
    const checkServer = async () => {
      const isConnected = await checkServerConnection();
      const status = isConnected ? "online" : "offline";
      setServerStatus(status);
      onStatusChange(status);
    };
    checkServer();
  }, [onStatusChange]);

  // Tampilkan loading saat checking server
  if (serverStatus === "checking") {
    return (
      <div className="flex justify-center items-center h-40 sm:h-64">
        <div className="flex items-center justify-center text-gray-600">
          <Loader2 className="animate-spin h-5 w-5 mr-2 text-blue-500" />
          Memeriksa koneksi server...
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika server offline
  if (serverStatus === "offline") {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded shadow-md">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-red-500" />
          <h3 className="font-bold text-sm sm:text-base">
            Server tidak dapat dijangkau
          </h3>
        </div>
        <p className="mt-2 text-sm sm:text-base">
          Server backend tidak berjalan atau tidak dapat diakses. Silakan
          periksa koneksi server dan refresh halaman.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 sm:mt-4 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded transition duration-300 flex items-center text-sm sm:text-base"
        >
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Refresh Halaman
        </button>
      </div>
    );
  }

  return null;
};

export default ServerStatusCheck;
