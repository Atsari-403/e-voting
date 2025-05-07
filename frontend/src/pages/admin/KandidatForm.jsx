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
    }
  };

  const handleDesignTypeChange = (e) => {
    const newDesignType = e.target.value;
    setFormData({
      ...formData,
      designType: newDesignType,
      // Reset file fields when switching between design types
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
      // Log untuk debugging
      console.log("Form data sebelum submit:", formData);

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
          console.log("Foto pamflet ditambahkan:", formData.fotoPamflet.name);
        } else {
          console.log("Tidak ada foto pamflet yang dipilih");
          setError("Foto pamflet wajib diupload untuk tipe desain gabungan");
          setLoading(false);
          return;
        }
      } else if (formData.designType === "separate") {
        if (formData.fotoKetua) {
          formDataObj.append("fotoKetua", formData.fotoKetua);
          console.log("Foto ketua ditambahkan:", formData.fotoKetua.name);
        } else {
          console.log("Tidak ada foto ketua yang dipilih");
          setError("Foto ketua wajib diupload untuk tipe desain terpisah");
          setLoading(false);
          return;
        }

        if (formData.fotoWakil) {
          formDataObj.append("fotoWakil", formData.fotoWakil);
          console.log("Foto wakil ditambahkan:", formData.fotoWakil.name);
        } else {
          console.log("Tidak ada foto wakil yang dipilih");
          setError("Foto wakil wajib diupload untuk tipe desain terpisah");
          setLoading(false);
          return;
        }
      }

      // Log untuk debugging
      console.log("FormData keys yang dikirim:");
      for (let key of formDataObj.keys()) {
        console.log("- " + key);
      }

      const response = await axios.post(
        "http://localhost:5000/api/candidates",
        formDataObj,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "Design-Type": formData.designType, // Menambahkan design type di header
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
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => (input.value = ""));
        alert("Kandidat berhasil ditambahkan!");
      }
    } catch (error) {
      console.error("Error saat menambah kandidat:", error);

      // Log detail error untuk debugging
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response status:", error.response.status);

        // Handle HTML error response
        if (
          typeof error.response.data === "string" &&
          error.response.data.includes("<!DOCTYPE html>")
        ) {
          // Extract error message from HTML
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
        console.error("No response received:", error.request);
        setError("Gagal menambah kandidat: Tidak ada respons dari server");
      } else {
        console.error("Error message:", error.message);
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

  // Tampilkan pesan jika server offline
  if (serverStatus === "offline") {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <h3 className="font-bold">Server tidak dapat dijangkau</h3>
        <p>
          Server backend tidak berjalan atau tidak dapat diakses. Silakan
          periksa koneksi server dan refresh halaman.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Refresh Halaman
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tambah Kandidat Baru</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tipe Desain</label>
          <select
            name="designType"
            value={formData.designType}
            onChange={handleDesignTypeChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="combined">Pamflet Gabungan</option>
            <option value="separate">Foto Terpisah</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Ketua</label>
            <input
              type="text"
              name="nameKetua"
              value={formData.nameKetua}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Wakil</label>
            <input
              type="text"
              name="nameWakil"
              value={formData.nameWakil}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Visi</label>
          <textarea
            name="visi"
            value={formData.visi}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Misi</label>
          <textarea
            name="misi"
            value={formData.misi}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        {formData.designType === "combined" ? (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Foto Pamflet</label>
            <input
              type="file"
              name="fotoPamflet"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
              accept="image/*"
              required
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Foto Ketua</label>
              <input
                type="file"
                name="fotoKetua"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md"
                accept="image/*"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Foto Wakil</label>
              <input
                type="file"
                name="fotoWakil"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md"
                accept="image/*"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Kandidat"}
        </button>
      </form>
    </div>
  );
};

export default KandidatForm;
