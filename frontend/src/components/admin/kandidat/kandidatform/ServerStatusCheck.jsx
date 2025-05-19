import React, { useState, useEffect } from "react";
import axios from "axios";

// Fungsi untuk memeriksa koneksi server
const checkServerConnection = async () => {
  try {
    await axios.get("http://localhost:5000/api/candidates", { timeout: 3000 });
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
        <div className="text-gray-600 animate-pulse">
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
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
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
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Halaman
        </button>
      </div>
    );
  }

  return null;
};

export default ServerStatusCheck;
