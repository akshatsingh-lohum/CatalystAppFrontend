"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

console.log("On the page, user / id / page 001");

export default function UserDetailsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params?.id;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  console.log("On the page, user / id / page");

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Or however you store your token

        console.log("Fetching user with id:", id);
        console.log("Token:", token);

        const response = await fetch(`${backendUrl}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id, backendUrl]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>User Details</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </div>
  );
}
