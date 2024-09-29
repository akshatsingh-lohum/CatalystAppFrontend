"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth"; // Adjust the import path as needed
import CompanyList from "@/app/fonts/components/Companylist";

export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, getToken } = useAuth(); // Use the authentication hook

  useEffect(() => {
    async function fetchCompanies() {
      if (!isAuthenticated) {
        setError("You must be logged in to view companies");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL is not defined");
        }

        const token = getToken(); // Get the JWT token
        const response = await fetch(`${apiUrl}/company`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again");
          }
          throw new Error("Failed to fetch company data");
        }

        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, [isAuthenticated]); // Re-run when authentication state changes

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <div>Please log in to view companies</div>;

  return (
    <div>
      <h1>Company Page</h1>
      <CompanyList companies={companies} />
    </div>
  );
}
