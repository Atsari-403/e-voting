import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ children, roleAllowed, blockNavigation = false }) => {
  const { updateUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
        updateUser(user); // Update UserContext
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

  // Navigation blocking effect
  useEffect(() => {
    if (!blockNavigation || isLoading || !isAuthenticated) return;

    const currentPath = location.pathname;

    // Flood history stack dengan banyak entry untuk block back button
    for (let i = 0; i < 50; i++) {
      window.history.pushState(
        { protectedPage: true, index: i },
        "",
        currentPath
      );
    }

    const blockBack = (event) => {
      // mencegah back button
      event.preventDefault();

      // Push state lagi untuk memastikan tetap terkunci
      window.history.pushState(
        { protectedPage: true, blocked: true },
        "",
        currentPath
      );

      // Force navigate ke halaman yang sama jika ada yang bypass
      if (window.location.pathname !== currentPath) {
        navigate(currentPath, { replace: true });
      }
    };

    const handleBeforeUnload = (event) => {
      // Warning saat user coba close tab/refresh
      event.preventDefault();
      event.returnValue = "Apakah Anda yakin ingin meninggalkan halaman ini?";
      return event.returnValue;
    };

    // Event listeners
    window.addEventListener("popstate", blockBack);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener("popstate", blockBack);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    blockNavigation,
    isLoading,
    isAuthenticated,
    location.pathname,
    navigate,
  ]);

  // loading spinner
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
