import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const KandidatForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("checking"); // 'checking', 'online', 'offline'
  const [formData, setFormData] = useState({
    nameKetua: "",
    nameWakil: "",
    visi: "",
    misi: "",
    designType: "combined",
    fotoPamflet: null,
    fotoKetua: null,
    fotoWakil: null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    fotoPamflet: null,
    fotoKetua: null,
    fotoWakil: null,
  });

  // Cek status server saat komponen dimuat
  useEffect(() => {
    const checkServer = async () => {
      const isConnected = await checkServerConnection();
      setServerStatus(isConnected ? "online" : "offline");
    };
    checkServer();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });

      // Membuat preview URL untuk gambar
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviewUrls({
        ...previewUrls,
        [name]: previewUrl,
      });
    }
  };

  const handleDesignTypeChange = (e) => {
    const newDesignType = e.target.value;
    setFormData({
      ...formData,
      designType: newDesignType,
      fotoPamflet: null,
      fotoKetua: null,
      fotoWakil: null,
    });

    // Reset file previews
    setPreviewUrls({
      fotoPamflet: null,
      fotoKetua: null,
      fotoWakil: null,
    });

    // Reset file input values
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Cek koneksi server sebelum submit
    const isConnected = await checkServerConnection();
    if (!isConnected) {
      setError(
        "Server tidak dapat dijangkau. Silakan periksa koneksi atau coba lagi nanti."
      );
      setLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();

      // Tambahkan semua field teks
      formDataObj.append("nameKetua", formData.nameKetua);
      formDataObj.append("nameWakil", formData.nameWakil);
      formDataObj.append("visi", formData.visi);
      formDataObj.append("misi", formData.misi);
      formDataObj.append("designType", formData.designType);

      // Tambahkan file sesuai dengan designType
      if (formData.designType === "combined") {
        if (formData.fotoPamflet) {
          formDataObj.append("fotoPamflet", formData.fotoPamflet);
        } else {
          setError("Foto pamflet wajib diupload untuk tipe desain gabungan");
          setLoading(false);
          return;
        }
      } else if (formData.designType === "separate") {
        if (formData.fotoKetua) {
          formDataObj.append("fotoKetua", formData.fotoKetua);
        } else {
          setError("Foto ketua wajib diupload untuk tipe desain terpisah");
          setLoading(false);
          return;
        }

        if (formData.fotoWakil) {
          formDataObj.append("fotoWakil", formData.fotoWakil);
        } else {
          setError("Foto wakil wajib diupload untuk tipe desain terpisah");
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(
        "http://localhost:5000/api/candidates",
        formDataObj,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "Design-Type": formData.designType,
          },
          timeout: 15000,
        }
      );

      if (response.status === 201) {
        onSuccess();
        setFormData({
          nameKetua: "",
          nameWakil: "",
          visi: "",
          misi: "",
          designType: "combined",
          fotoPamflet: null,
          fotoKetua: null,
          fotoWakil: null,
        });
        setPreviewUrls({
          fotoPamflet: null,
          fotoKetua: null,
          fotoWakil: null,
        });
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => (input.value = ""));

        // Gunakan notifikasi toast yang lebih elegan
        // Di sini hanya menggunakan alert untuk simplicity
        alert("Kandidat berhasil ditambahkan!");
      }
    } catch (error) {
      console.error("Error saat menambah kandidat:", error);

      if (error.response) {
        if (
          typeof error.response.data === "string" &&
          error.response.data.includes("<!DOCTYPE html>")
        ) {
          const errorMatch = error.response.data.match(/<pre>([^<]+)<\/pre>/);
          const errorMessage = errorMatch
            ? errorMatch[1].split("<br>")[0]
            : "Server error";
          setError(`Gagal menambah kandidat: ${errorMessage}`);
        } else {
          setError(
            `Gagal menambah kandidat: ${
              error.response.data.message || error.response.statusText
            }`
          );
        }
      } else if (error.request) {
        setError("Gagal menambah kandidat: Tidak ada respons dari server");
      } else {
        setError(`Gagal menambah kandidat: ${error.message}`);
      }

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded shadow-sm">
          <div className="flex">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Tipe Desain
          </label>
          <div className="relative">
            <select
              name="designType"
              value={formData.designType}
              onChange={handleDesignTypeChange}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 sm:py-3 px-3 sm:px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            >
              <option value="combined">Pamflet Gabungan</option>
              <option value="separate">Foto Terpisah</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {formData.designType === "combined"
              ? "Upload satu pamflet gabungan dengan foto ketua dan wakil"
              : "Upload foto ketua dan wakil secara terpisah"}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 bg-white">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
            Informasi Kandidat
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                Nama Ketua
              </label>
              <input
                type="text"
                name="nameKetua"
                value={formData.nameKetua}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Masukkan nama ketua"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                Nama Wakil
              </label>
              <input
                type="text"
                name="nameWakil"
                value={formData.nameWakil}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Masukkan nama wakil"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white rounded-lg mb-4 sm:mb-6">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
            Visi & Misi
          </h3>
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
              Visi
            </label>
            <textarea
              name="visi"
              value={formData.visi}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              rows="3"
              placeholder="Jelaskan visi kandidat"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
              Misi
            </label>
            <textarea
              name="misi"
              value={formData.misi}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              rows="4"
              placeholder="Jelaskan misi kandidat"
              required
            ></textarea>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 bg-white">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
            Unggah Foto
          </h3>
          {formData.designType === "combined" ? (
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                Foto Pamflet
              </label>
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  name="fotoPamflet"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
                {previewUrls.fotoPamflet && (
                  <div className="mt-4 w-full max-w-md">
                    <img
                      src={previewUrls.fotoPamflet}
                      alt="Preview Foto Pamflet"
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                  Foto Ketua
                </label>
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    name="fotoKetua"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                  {previewUrls.fotoKetua && (
                    <div className="mt-4 w-full max-w-md">
                      <img
                        src={previewUrls.fotoKetua}
                        alt="Preview Foto Ketua"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                  Foto Wakil
                </label>
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    name="fotoWakil"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                  {previewUrls.fotoWakil && (
                    <div className="mt-4 w-full max-w-md">
                      <img
                        src={previewUrls.fotoWakil}
                        alt="Preview Foto Wakil"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
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
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              "Simpan Kandidat"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KandidatForm;
