// src/app/components/Sidebar.js
import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="bg-indigo-800 w-64 space-y-6 py-7 px-2 text-white">
      <div className="flex items-center space-x-4 px-4 mb-6">
        <div className="w-10 h-10 bg-white rounded-full"></div>
        <span className="text-lg font-semibold">Catalyst App</span>
      </div>
      <Link
        href="/dashboard"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700"
      >
        Dashboard
      </Link>

      <Link
        href="/request"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700"
      >
        Request
      </Link>

      <Link
        href="/user"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700"
      >
        User
      </Link>
      <Link
        href="/dashboard/dealer"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700"
      >
        Dealer
      </Link>
      <Link
        href="/company"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700"
      >
        Company
      </Link>
    </nav>
  );
}
