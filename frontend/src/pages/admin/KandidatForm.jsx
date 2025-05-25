import React from "react";
import useKandidatForm from "../../hooks/useKandidatForm";
import ServerStatusCheck from "../../components/admin/kandidat/kandidatform/ServerStatusCheck";
import ErrorDisplay from "../../components/admin/kandidat/kandidatform/ErrorDisplay";
import DesignTypeSelector from "../../components/admin/kandidat/kandidatform/DesignTypeSelector";
import CandidateInfo from "../../components/admin/kandidat/kandidatform/CandidateInfo";
import VisionMission from "../../components/admin/kandidat/kandidatform/VisionMission";
import PhotoUpload from "../../components/admin/kandidat/kandidatform/PhotoUpload";
import SubmitButton from "../../components/admin/kandidat/kandidatform/SubmitButton";

const KandidatForm = ({ onSuccess }) => {
  // hook untuk semua logic
  const {
    loading,
    error,
    formData,
    previewUrls,
    handleInputChange,
    handleFileChange,
    handleDesignTypeChange,
    handleSubmit,
  } = useKandidatForm(onSuccess);

  const [serverStatus, setServerStatus] = React.useState("checking");

  const handleServerStatusChange = (status) => {
    setServerStatus(status);
  };

  // Jika server offline, tampilkan server status check saja
  if (serverStatus !== "online") {
    return (
      <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
        <ServerStatusCheck onStatusChange={handleServerStatusChange} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
      {/* Server Status Check */}
      <ServerStatusCheck onStatusChange={handleServerStatusChange} />

      {/* Error Display */}
      <ErrorDisplay error={error} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Design Type Selector */}
        <DesignTypeSelector
          value={formData.designType}
          onChange={handleDesignTypeChange}
        />

        {/* Candidate Information */}
        <CandidateInfo formData={formData} onChange={handleInputChange} />

        {/* Vision & Mission */}
        <VisionMission formData={formData} onChange={handleInputChange} />

        {/* Photo Upload */}
        <PhotoUpload
          designType={formData.designType}
          previewUrls={previewUrls}
          onChange={handleFileChange}
        />

        {/* Submit Button */}
        <SubmitButton loading={loading} />
      </form>
    </div>
  );
};

export default KandidatForm;
