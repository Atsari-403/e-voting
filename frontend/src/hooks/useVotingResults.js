import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useVotingResults = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteData, setVoteData] = useState({
    candidates: [],
    totalVoters: 0,
    lastUpdated: null,
  });
  const navigate = useNavigate();

  const fetchVoteResults = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/users/vote-results",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setVoteData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error detail:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        path: error.response?.config?.url,
      });

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError("Gagal memuat data hasil voting");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteResults();

    // Polling setiap 30 detik untuk mendapatkan data terbaru
    const interval = setInterval(fetchVoteResults, 30000);

    // Cleanup interval pada unmount
    return () => clearInterval(interval);
  }, [navigate]);

  return { loading, error, voteData };
};

export default useVotingResults;
