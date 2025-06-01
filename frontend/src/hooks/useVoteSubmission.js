import { useState } from "react";
import axios from "axios";

const useVoteSubmission = (onVoteSuccess) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const submitVote = async (candidateId, timeExpired) => {
    if (timeExpired) {
      setSubmissionError(
        "Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await axios.post(
        "http://localhost:5000/api/users/vote-candidate",
        { candidateId },
        { withCredentials: true }
      );
      onVoteSuccess(); // Notify parent component
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting vote:", err);
      if (err.response?.data?.hasVoted) {
        onVoteSuccess(); // Ensure parent's hasVoted state is updated
      }
      setSubmissionError(
        `Gagal melakukan voting: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVote,
    isSubmitting,
    submissionError,
    showSuccessModal,
    setSubmissionError,
    setShowSuccessModal,
  };
};

export default useVoteSubmission;
