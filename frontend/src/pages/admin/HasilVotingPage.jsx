import React from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import useVotingResults from "../../hooks/useVotingResults";
import LoadingState from "../../components/admin/hasilVoting/LoadingState";
import EmptyState from "../../components/admin/hasilVoting/EmptyState";
// import Header from "../../components/admin/hasilVoting/Header";
import ErrorMessage from "../../components/admin/hasilVoting/ErrorMessage";
import VoteStats from "../../components/admin/hasilVoting/VoteStats";
import PieChartSection from "../../components/admin/hasilVoting/PieChartSection";
import CandidateList from "../../components/admin/hasilVoting/CandidateList";

const HasilVotingPage = () => {
  // custom hook 
  const { loading, error, voteData } = useVotingResults();

  // loading state
  if (loading) {
    return (
      <AdminDashboardLayout>
        <LoadingState />
      </AdminDashboardLayout>
    );
  }

  // empty state
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
          {/* <Header lastUpdated={voteData.lastUpdated} /> */}

          {/* Error Message */}
          <ErrorMessage message={error} />

          {/* Stats Cards */}
          <VoteStats voteData={voteData} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidate List */}
            <div className="md:col-span-2">
              <CandidateList candidates={voteData.candidates} />
            </div>

            {/* Pie Chart */}
            <div>
              <PieChartSection candidates={voteData.candidates} />
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default HasilVotingPage;
