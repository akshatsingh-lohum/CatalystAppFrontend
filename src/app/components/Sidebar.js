// src/app/components/Sidebar.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch menu items
        const menuResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menu-items`
        );
        if (!menuResponse.ok) throw new Error("Failed to fetch menu items");
        const menuData = await menuResponse.json();

        // Fetch user role (you'll need to implement this endpoint)
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user-role`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user role");
        const userData = await userResponse.json();

        setMenuItems(menuData);
        setUserRole(userData.role);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to default menu items if fetch fails
        setMenuItems([
          { href: "/", label: "Dashboard", roles: ["user", "admin"] },
          { href: "/request", label: "Request", roles: ["user", "admin"] },
          { href: "/user", label: "User", roles: ["admin"] },
          { href: "/dealer", label: "Dealer", roles: ["admin"] },
          { href: "/company", label: "Company", roles: ["admin"] },
        ]);
        setUserRole("user"); // Default to lowest privilege
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
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
