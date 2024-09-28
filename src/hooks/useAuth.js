// File: ../hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/verify-token`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        console.error("Token invalid:", error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

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
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = () => localStorage.getItem("token");

  return { isAuthenticated, user, login, logout, checkAuth, getToken };
};
