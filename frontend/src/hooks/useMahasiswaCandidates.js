import { useState, useEffect } from "react";
import axios from "axios";

const useMahasiswaCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setCandidatesLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/candidates",
          {
            withCredentials: true,
          }
        );
        setCandidates(response.data);
        setCandidatesError(null);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setCandidatesError("Gagal memuat data kandidat");
      } finally {
        setCandidatesLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return { candidates, candidatesLoading, candidatesError, setCandidatesError };
};

export default useMahasiswaCandidates;
