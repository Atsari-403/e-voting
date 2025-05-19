import React from "react";
import CandidateCard from "./CandidateCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

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
    <div className="space-y-4 sm:space-y-6">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CandidateList;
