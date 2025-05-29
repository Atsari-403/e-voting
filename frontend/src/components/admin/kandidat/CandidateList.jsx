import React from "react";
import CandidateCard from "./CandidateCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import { Plus } from "lucide-react";

const CandidateList = ({
  candidates,
  loading,
  error,
  onDelete,
  onAddNewCandidate,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (candidates.length === 0) {
    return <EmptyState onAddNewCandidate={onAddNewCandidate} />;
  }

  return (
    <div className="space-y-6">
      {/* Candidates Grid */}
      <div className="grid gap-6">
        {candidates.map((candidate, index) => (
          <div
            key={candidate.id}
            className="transform transition-all duration-300 hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CandidateCard candidate={candidate} onDelete={onDelete} />
          </div>
        ))}
      </div>

      {/* tombol tambah kandidat  */}
      <button
        onClick={onAddNewCandidate}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 
                   text-white p-4 rounded-full shadow-lg hover:shadow-xl 
                   transform hover:scale-110 transition-all duration-300
                   focus:outline-none focus:ring-4 focus:ring-blue-300/50
                   group z-50"
        title="Tambah Kandidat Baru"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default CandidateList;
