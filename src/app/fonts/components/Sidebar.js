"use client";

import React from "react";
import { useRouter } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/request", label: "Request" },
  { href: "/user", label: "User" },
  { href: "/dealer", label: "Dealer" },
  { href: "/company", label: "Company" },
  { href: "/logout", label: "Logout", isLogout: true },
];

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img
          src="static/images/catalyst.png"
          alt="Catalyst Logo"
          className="logo-image"
        />
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              {item.isLogout ? (
                <button onClick={handleLogout}>{item.label}</button>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        .sidebar {
          background: linear-gradient(to bottom, #667eea, #764ba2);
          color: #ffffff;
          width: 250px;
          height: 100vh;
          padding: 20px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .logo {
          margin-bottom: 20px;
          text-align: center;
        }

        nav {
          flex-grow: 1;
        }

        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        li {
          margin-bottom: 10px;
        }

        a,
        button {
          display: block;
          color: #ffffff;
          text-decoration: none;
          padding: 10px 15px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
          font-size: 16px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }

        a:hover,
        button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        button {
          margin-top: 20px;
          border: 1px solid #ffffff;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
