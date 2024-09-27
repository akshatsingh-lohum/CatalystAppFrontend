// src/app/company/page.js
"use client";

import { useState, useEffect } from "react";
import CompanyList from "../components/Companylist";

export default function CompanyPage() {
  const [company, setCompany] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    async function fetchCompany() {
      setIsLoading(true);
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL is not defined");
        }
        const response = await fetch(`${apiUrl}/company`);
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Company Page</h1>
      <CompanyList company={company} />
    </div>
  );
}
