"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define menu items statically since they're not coming from the API
  const menuItems = [
    { href: "/", label: "Dashboard", roles: ["user", "admin"] },
    { href: "/request", label: "Request", roles: ["user", "admin"] },
    { href: "/user", label: "User", roles: ["admin"] },
    { href: "/dealer", label: "Dealer", roles: ["user", "admin"] },
    { href: "/company", label: "Company", roles: ["admin"] },
  ];

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userRole`
        );
        if (!response.ok) throw new Error("Failed to fetch user role");
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("user"); // Default to lowest privilege
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  if (isLoading) {
    return <div>Loading menu...</div>;
  }

  return (
    <nav className="bg-indigo-800 w-64 space-y-8 py-0 px-0 text-white">
      <div className="">
        <img
          src="/static/images/catalyst.png"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>
      {menuItems
        .filter((item) => item.roles.includes(userRole))
        .map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700"
          >
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
