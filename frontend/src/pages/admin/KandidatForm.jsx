import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ServerStatusCheck from "../../components/admin/kandidat/kandidatform/ServerStatusCheck";
import ErrorDisplay from "../../components/admin/kandidat/kandidatform/ErrorDisplay";
import DesignTypeSelector from "../../components/admin/kandidat/kandidatform/DesignTypeSelector";
import CandidateInfo from "../../components/admin/kandidat/kandidatform/CandidateInfo";
import VisionMission from "../../components/admin/kandidat/kandidatform/VisionMission";
import PhotoUpload from "../../components/admin/kandidat/kandidatform/PhotoUpload";
import SubmitButton from "../../components/admin/kandidat/kandidatform/SubmitButton";

const KandidatForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("checking");
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

  const handleServerStatusChange = (status) => {
    setServerStatus(status);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleDesignTypeChange = (e) => {
    const newDesignType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      designType: newDesignType,
      fotoPamflet: null,
      fotoKetua: null,
      fotoWakil: null,
    }));

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

    try {
      const formDataObj = new FormData();
      formDataObj.append("nameKetua", formData.nameKetua);
      formDataObj.append("nameWakil", formData.nameWakil);
      formDataObj.append("visi", formData.visi);
      formDataObj.append("misi", formData.misi);
      formDataObj.append("designType", formData.designType);

      if (formData.designType === "combined") {
        if (!formData.fotoPamflet) {
          throw new Error(
            "Foto pamflet wajib diupload untuk tipe desain gabungan"
          );
        }
        formDataObj.append("fotoPamflet", formData.fotoPamflet);
      } else {
        if (!formData.fotoKetua || !formData.fotoWakil) {
          throw new Error(
            "Foto ketua dan wakil wajib diupload untuk tipe desain terpisah"
          );
        }
        formDataObj.append("fotoKetua", formData.fotoKetua);
        formDataObj.append("fotoWakil", formData.fotoWakil);
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
        alert("Kandidat berhasil ditambahkan!");
      }
    } catch (error) {
      console.error("Error saat menambah kandidat:", error);
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
      <ServerStatusCheck onStatusChange={handleServerStatusChange} />
      {serverStatus === "online" && (
        <>
          <ErrorDisplay error={error} />
          <form onSubmit={handleSubmit}>
            <DesignTypeSelector
              value={formData.designType}
              onChange={handleDesignTypeChange}
            />
            <CandidateInfo formData={formData} onChange={handleInputChange} />
            <VisionMission formData={formData} onChange={handleInputChange} />
            <PhotoUpload
              designType={formData.designType}
              previewUrls={previewUrls}
              onChange={handleFileChange}
            />
            <SubmitButton loading={loading} />
          </form>
        </>
      )}
    </div>
  );
};

export default KandidatForm;
