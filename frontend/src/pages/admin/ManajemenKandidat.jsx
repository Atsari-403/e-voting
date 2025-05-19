import React, { useState } from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import NavigationTabs from "../../components/admin/kandidat/NavigationTabs";
import CandidateList from "../../components/admin/kandidat/CandidateList";
import { KandidatForm } from "../../components/admin/kandidat/kandidatform";
import useCandidates from "../../hooks/useCandidates";

const ManajemenKandidat = () => {
  const [activeTab, setActiveTab] = useState("daftar");
  const {
    candidates,
    loading,
    error,
    refreshCandidates,
    handleDeleteCandidate,
  } = useCandidates();

  // Handler ketika kandidat berhasil ditambahkan
  const handleCandidateAdded = () => {
    refreshCandidates();
    setActiveTab("daftar"); // Pindah ke tab daftar setelah menambahkan
  };

  // Handler untuk pindah ke tab tambah kandidat
  const handleAddNewCandidate = () => {
    setActiveTab("tambah");
  };

  const renderTabContent = () => {
    if (activeTab === "daftar") {
      return (
        <div>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Daftar Kandidat
            </h2>
          </div>
          <CandidateList
            candidates={candidates}
            loading={loading}
            error={error}
            onDelete={handleDeleteCandidate}
            onAddNewCandidate={handleAddNewCandidate}
          />
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Tambah Kandidat Baru
        </h2>
        <KandidatForm onSuccess={handleCandidateAdded} />
      </div>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto px-4 py-3 sm:p-4 max-w-6xl">
        {/* Main Content Container */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Navigation Tabs */}
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-4 sm:p-6">{renderTabContent()}</div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ManajemenKandidat;
