import { useState, useEffect, useRef } from "react";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

const useVotingTimer = (durationInSeconds, hasVoted) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [timeExpired, setTimeExpired] = useState(false);
  const [timerError, setTimerError] = useState(null);
  const intervalRef = useRef(null);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(durationInSeconds);
    setTimeExpired(false);
    setTimerError(null);
  }, [durationInSeconds]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't start timer if user has voted
    if (hasVoted) {
      return;
    }

    // Don't start timer if time is already expired
    if (timeLeft <= 0) {
      if (!timeExpired) {
        setTimeExpired(true);
        setTimerError(
          "Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi."
        );
      }
      return;
    }

    // Start the countdown
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft = prevTimeLeft - 1;

        // Check if time has expired
        if (newTimeLeft <= 0) {
          setTimeExpired(true);
          setTimerError(
            "Waktu voting telah habis! Anda tidak dapat memilih kandidat lagi."
          );
          return 0;
        }

        return newTimeLeft;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeLeft, hasVoted, timeExpired]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    timeExpired,
    timerError,
    setTimerError,
  };
};

// optional
export const VOTING_DURATIONS = {
  FIFTEEN_SECONDS: 15,
  THIRTY_SECONDS: 30,
  ONE_MINUTE: 60,
  TWO_MINUTES: 120,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  FIFTEEN_MINUTES: 900,
};

export default useVotingTimer;
