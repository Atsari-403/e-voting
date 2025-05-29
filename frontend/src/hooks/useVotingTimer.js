import { useState, useEffect } from 'react';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

const useVotingTimer = (initialTime, hasVoted) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timeExpired, setTimeExpired] = useState(false);
  const [timerError, setTimerError] = useState(null);

  useEffect(() => {
    if (hasVoted) {
      // If user has voted, timer should not run.
      // Optionally, set timeLeft to 0 or a specific state.
      // For now, just ensure the interval doesn't run.
      return;
    }

    if (timeLeft <= 0) {
      setTimeExpired(true);
      setTimerError("Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi.");
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, hasVoted, initialTime]);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    timeExpired,
    timerError,
    setTimerError,
  };
};

export default useVotingTimer;
