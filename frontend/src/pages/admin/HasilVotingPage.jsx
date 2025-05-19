import React from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import useVotingResults from "../../hooks/useVotingResults";

// Import komponen yang sudah dipecah
import LoadingState from "../../components/admin/hasilVoting/LoadingState";
import EmptyState from "../../components/admin/hasilVoting/EmptyState";
import Header from "../../components/admin/hasilVoting/Header";
import ErrorMessage from "../../components/admin/hasilVoting/ErrorMessage";
import VoteStats from "../../components/admin/hasilVoting/VoteStats";
import PieChartSection from "../../components/admin/hasilVoting/PieChartSection";
import CandidateList from "../../components/admin/hasilVoting/CandidateList";

const HasilVotingPage = () => {
  // Menggunakan custom hook untuk mengambil data
  const { loading, error, voteData } = useVotingResults();

  // Menampilkan loading state
  if (loading) {
    return (
      <AdminDashboardLayout>
        <LoadingState />
      </AdminDashboardLayout>
    );
  }

  // Menampilkan pesan jika tidak ada kandidat
  if (voteData.candidates.length === 0) {
    return (
      <AdminDashboardLayout>
        <EmptyState />
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header dengan info update terakhir */}
          <Header lastUpdated={voteData.lastUpdated} />

          {/* Error Message */}
          <ErrorMessage message={error} />

          {/* Stats Cards */}
          <VoteStats voteData={voteData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <PieChartSection candidates={voteData.candidates} />

            {/* Candidate List */}
            <CandidateList candidates={voteData.candidates} />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default HasilVotingPage;
