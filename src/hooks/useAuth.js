import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    console.log("Checking auth with token:", token);

    if (!token) {
      console.log("No token found, user is not authenticated");
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/verify`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Verification successful, user authenticated");
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      console.error("Token verification failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        credentials
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setUser(user);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    console.log("Logout successful");
  };

  const getToken = () => localStorage.getItem("token");

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
    getToken,
    isLoading,
  };
};
