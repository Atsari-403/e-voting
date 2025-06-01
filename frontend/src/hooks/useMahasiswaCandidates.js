import { useState, useEffect } from 'react';
import candidateService from '../services/candidateService';

const useMahasiswaCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setCandidatesLoading(true);
      try {
        const response = await candidateService.getAllCandidates();
        setCandidates(response.data);
        setCandidatesError(null);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setCandidatesError('Gagal memuat data kandidat');
      } finally {
        setCandidatesLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return { candidates, candidatesLoading, candidatesError, setCandidatesError };
};

export default useMahasiswaCandidates;
