// src/app/components/Header.js
export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200">
          + New Job
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
}
