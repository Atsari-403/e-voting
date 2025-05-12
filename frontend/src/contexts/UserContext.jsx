import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Set base URL
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const UserContext = createContext();

// Add custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }

      // Set token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("/api/auth/verify");
      console.log("Verify response:", response.data);

      if (response.data.valid) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Auth check error:", error.response?.data || error.message);
      sessionStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
    return false;
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      const { token, user } = response.data;

      sessionStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return false;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        checkAuthStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
