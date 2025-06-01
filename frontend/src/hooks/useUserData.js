import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import authService from "../services/authService";

const useUserData = () => {
  const { updateUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await authService.getMe();
        setUserData(responseData);
        updateUser(responseData);
        setHasVoted(responseData.hasVoted);
        if (responseData.hasVoted) {
          setUserError(
            "Anda sudah memberikan suara sebelumnya. Tombol voting telah dinonaktifkan."
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // The service logs the error too. Here we set UI error and navigate.
        // Check if it's a 401 to avoid navigating for other errors if not desired
        // However, getMe is critical, so any failure might warrant logout/redirect.
        // The existing code navigates on any error.
        setUserError("Gagal memuat data pengguna. Sesi mungkin telah berakhir.");
        navigate("/");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return { userData, hasVoted, userLoading, userError, setUserError };
};

export default useUserData;
