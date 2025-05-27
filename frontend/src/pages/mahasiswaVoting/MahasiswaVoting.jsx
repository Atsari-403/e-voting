import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For handleLogout

// Import Hooks
import { useUserData } from '../../hooks/useUserData';
import { useVotingTimer } from '../../hooks/useVotingTimer';
import { useMahasiswaCandidates } from '../../hooks/useMahasiswaCandidates';
import { useVoteSubmission } from '../../hooks/useVoteSubmission';

// Import Components
import Header from '../../components/user/Header';
import StatusBanners from '../../components/user/StatusBanners';
import PageTitle from '../../components/user/PageTitle';
import LoadingSpinner from '../../components/user/LoadingSpinner';
import ErrorMessage from '../../components/user/ErrorMessage';
import CandidateCard from '../../components/user/CandidateCard';
import VotingInstructions from '../../components/user/VotingInstructions';
import PageFooter from '../../components/user/PageFooter';
import ConfirmationModal from '../../components/user/ConfirmationModal';
import SuccessModal from '../../components/user/SuccessModal';

const MahasiswaVoting = () => {
  const navigate = useNavigate();

  // Basic State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pageError, setPageError] = useState('');
  const [hasVoted, setHasVoted] = useState(false); // Will be updated by useUserData

  // Custom Hooks
  const { userData, hasVoted: initialHasVoted, userLoading, userError, setUserError } = useUserData();
  const { candidates, candidatesLoading, candidatesError, setCandidatesError } = useMahasiswaCandidates();

  useEffect(() => {
    setHasVoted(initialHasVoted);
  }, [initialHasVoted]);

  const { formattedTime, timeExpired, timerError, setTimerError } = useVotingTimer(
    900, // 15 minutes * 60 seconds
    hasVoted 
  );

  const { 
    submitVote, 
    isSubmitting, 
    submissionError, 
    showSuccessModal: voteSubmissionSuccessModal, // Renamed to avoid conflict with component prop
    setSubmissionError, 
    setShowSuccessModal: setShowVoteSubmissionSuccessModal // Renamed for clarity
  } = useVoteSubmission(() => {
    setHasVoted(true);
    setShowConfirmationModal(false);
  });

  // Error Aggregation Logic
  useEffect(() => {
    if (userError) setPageError(userError);
    else if (candidatesError) setPageError(candidatesError);
    else if (timerError && !hasVoted && !timeExpired) setPageError(timerError);
    else if (submissionError) setPageError(submissionError);
    else setPageError('');
  }, [userError, candidatesError, timerError, submissionError, hasVoted, timeExpired]);

  // Effect to clear specific hook errors if pageError is set by something else or conditions change
  useEffect(() => {
    if (pageError !== userError && userError) setUserError(null);
    if (pageError !== candidatesError && candidatesError) setCandidatesError(null);
    if (pageError !== timerError && timerError) setTimerError(null);
    if (pageError !== submissionError && submissionError) setSubmissionError(null);
  }, [pageError, userError, candidatesError, timerError, submissionError, setUserError, setCandidatesError, setTimerError, setSubmissionError]);

  // Helper Functions and Handlers (to be reviewed/modified later)
  const baseImageUrl = "http://localhost:5000/uploads/";
  const formatImagePath = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    let formattedPath = path;
    if (path.startsWith("/uploads/")) {
      formattedPath = path.replace("/uploads/", "");
    }
    if (formattedPath.startsWith("/")) {
      formattedPath = formattedPath.substring(1);
    }
    return `${baseImageUrl}${formattedPath}`;
  };

  const handleSelectCandidate = (candidate) => {
    if (hasVoted) {
      setPageError("Anda sudah memberikan suara sebelumnya. Tidak dapat memilih kandidat lagi.");
      return;
    }
    if (timeExpired) {
      setPageError("Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi.");
      return;
    }
    setSelectedCandidate(candidate);
    setShowConfirmationModal(true);
  };

  const handleConfirmVote = async () => {
    if (timeExpired) {
      setPageError("Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi.");
      setShowConfirmationModal(false);
      return;
    }
    if (selectedCandidate) {
      await submitVote(selectedCandidate.id, timeExpired);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setPageError("Gagal melakukan logout.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col">
      <Header
        userData={userData}
        formattedTime={formattedTime}
        timeExpired={timeExpired}
        hasVoted={hasVoted}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-4 sm:py-8 flex-grow">
        <StatusBanners hasVoted={hasVoted} timeExpired={timeExpired} />

        <PageTitle
          formattedTime={formattedTime}
          hasVoted={hasVoted}
          timeExpired={timeExpired}
        />

        <LoadingSpinner loading={userLoading || candidatesLoading || isSubmitting} />
        
        {/* Display pageError:
            - Show if pageError exists.
            - AND if user has NOT voted (because useUserData might set an error for already voted, which is handled by StatusBanners).
            - AND if time has NOT expired (because useVotingTimer might set an error for time expired, also handled by StatusBanners).
            - OR if the error is specifically a submission error (which should always be shown if present).
        */}
        {pageError && 
         !((hasVoted || timeExpired) && (userError || timerError)) || submissionError
         ? <ErrorMessage message={pageError} /> : null
        }


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {candidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              index={index}
              hasVoted={hasVoted}
              timeExpired={timeExpired}
              onSelectCandidate={handleSelectCandidate}
              formatImagePath={formatImagePath}
            />
          ))}
        </div>

        <VotingInstructions />
      </main>

      <PageFooter />

      <ConfirmationModal
        show={showConfirmationModal}
        candidate={selectedCandidate}
        candidates={candidates} // Pass the full list of candidates
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmVote}
      />

      <SuccessModal show={voteSubmissionSuccessModal} />
    </div>
  );
};

export default MahasiswaVoting;
