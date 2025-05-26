import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

  // Handler untuk perubahan input text
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk perubahan file upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      // Membuat preview URL untuk gambar
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviewUrls((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  // Handler untuk perubahan tipe desain
  const handleDesignTypeChange = (e) => {
    const newDesignType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      designType: newDesignType,
      fotoPamflet: null,
      fotoKetua: null,
      fotoWakil: null,
    }));

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

  // Fungsi untuk reset form
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

    // Reset file input values
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  // Handler untuk submit form
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

      // SweetAlert untuk koneksi error
      Swal.fire({
        title: "Koneksi Gagal!",
        text: "Server tidak dapat dijangkau. Silakan periksa koneksi atau coba lagi nanti.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      // Validasi data sebelum submit
      if (!formData.nameKetua.trim() || !formData.nameWakil.trim()) {
        throw new Error("Nama ketua dan wakil tidak boleh kosong");
      }

      if (!formData.visi.trim() || !formData.misi.trim()) {
        throw new Error("Visi dan misi tidak boleh kosong");
      }

      const formDataObj = new FormData();

      // Tambahkan semua field teks
      formDataObj.append("nameKetua", formData.nameKetua.trim());
      formDataObj.append("nameWakil", formData.nameWakil.trim());
      formDataObj.append("visi", formData.visi.trim());
      formDataObj.append("misi", formData.misi.trim());
      formDataObj.append("designType", formData.designType);

      // Tambahkan file sesuai dengan designType
      if (formData.designType === "combined") {
        if (!formData.fotoPamflet) {
          throw new Error(
            "Foto pamflet wajib diupload untuk tipe desain gabungan"
          );
        }
        formDataObj.append("fotoPamflet", formData.fotoPamflet);
      } else if (formData.designType === "separate") {
        if (!formData.fotoKetua) {
          throw new Error(
            "Foto ketua wajib diupload untuk tipe desain terpisah"
          );
        }
        if (!formData.fotoWakil) {
          throw new Error(
            "Foto wakil wajib diupload untuk tipe desain terpisah"
          );
        }
        formDataObj.append("fotoKetua", formData.fotoKetua);
        formDataObj.append("fotoWakil", formData.fotoWakil);
      }

      // Kirim data ke server
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
        // callback onSuccess
        if (onSuccess) {
          onSuccess();
        }

        // Simpan nama kandidat sebelum reset
        const candidateName = `${formData.nameKetua} & ${formData.nameWakil}`;

        // Reset form
        resetForm();

        // SweetAlert untuk sukses
        await Swal.fire({
          title: "Berhasil!",
          text: `Kandidat ${candidateName} berhasil ditambahkan!`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error saat menambah kandidat:", error);

      let errorMessage = "Terjadi kesalahan saat menambah kandidat";

      if (error.response) {
        // Error dari server
        if (error.response.status === 401) {
          navigate("/login");
          return;
        }

        if (
          typeof error.response.data === "string" &&
          error.response.data.includes("<!DOCTYPE html>")
        ) {
          // Jika response adalah HTML, ambil pesan error dari dalam tag <pre>
          const errorMatch = error.response.data.match(/<pre>([^<]+)<\/pre>/);
          errorMessage = errorMatch
            ? errorMatch[1].split("<br>")[0]
            : "Server error";
        } else {
          errorMessage =
            error.response.data?.message ||
            error.response.statusText ||
            "Server error";
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Tidak ada respons dari server";
      } else {
        // Validation atau error lainnya
        errorMessage = error.message;
      }

      // Set error state
      setError(`Gagal menambah kandidat: ${errorMessage}`);

      // SweetAlert untuk error
      Swal.fire({
        title: "Error!",
        text: `Gagal menambah kandidat: ${errorMessage}`,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    loading,
    error,
    formData,
    previewUrls,

    // Handlers
    handleInputChange,
    handleFileChange,
    handleDesignTypeChange,
    handleSubmit,

    // Utilities
    resetForm,
  };
};

export default useKandidatForm;
