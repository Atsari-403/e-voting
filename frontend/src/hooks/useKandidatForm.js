import { useState } from "react";
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

const useKandidatForm = (onSuccess) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const resetForm = () => {
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
        resetForm();
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

  return {
    loading,
    error,
    formData,
    previewUrls,
    handleInputChange,
    handleFileChange,
    handleDesignTypeChange,
    handleSubmit,
  };
};

export default useKandidatForm;
