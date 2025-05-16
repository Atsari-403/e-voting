import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthRedirect = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check authentication status from backend
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        if (response.status === 401) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const user = await response.json();
        if (!user) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUserRole(user.role);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying authentication:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  // Redirect already logged-in users to their appropriate dashboard
  if (isAuthenticated) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/mahasiswa/voting" replace />;
    }
  }

  // If not authenticated, show the login page
  return children;
};

export default AuthRedirect;
