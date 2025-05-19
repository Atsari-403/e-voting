import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, roleAllowed }) => {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle role-based redirects
  if (roleAllowed && userRole !== roleAllowed) {
    // If user is admin but tries to access student pages
    if (userRole === "admin" && roleAllowed === "mahasiswa") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // If user is student but tries to access admin pages
    if (userRole === "mahasiswa" && roleAllowed === "admin") {
      return <Navigate to="/mahasiswa/voting" replace />;
    }
  }

  // If authenticated and role matches, render the protected content
  return children;
};

export default ProtectedRoute;
