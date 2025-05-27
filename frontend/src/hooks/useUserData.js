import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        setUserData(response.data);
        setHasVoted(response.data.hasVoted);
        if (response.data.hasVoted) {
          setUserError(
            'Anda sudah memberikan suara sebelumnya. Tombol voting telah dinonaktifkan.'
          );
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserError('Gagal memuat data pengguna.');
        navigate('/');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return { userData, hasVoted, userLoading, userError, setUserError };
};

export default useUserData;
