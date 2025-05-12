import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, checkAuthStatus } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    // Verifikasi status autentikasi pada setiap navigasi
    const verifyAuth = async () => {
      await checkAuthStatus();
    };

    verifyAuth();

    // Menangani tombol back browser
    const handleNavigation = (e) => {
      if (!isAuthenticated) {
        window.location.replace("/login");
      }
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [location.pathname, checkAuthStatus, isAuthenticated]);

  // Cek autentikasi
  if (!isAuthenticated) {
    // Redirect ke login dengan menyimpan intended URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Cek otorisasi berdasarkan role jika diperlukan
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect ke halaman yang sesuai berdasarkan role
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "mahasiswa") {
      return <Navigate to="/mahasiswa/voting" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
