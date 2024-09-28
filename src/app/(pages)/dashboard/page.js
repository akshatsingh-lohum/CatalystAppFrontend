export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to the Catalyst App
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Jobs</h2>
          <p className="text-4xl font-bold text-indigo-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">New Applicants</h2>
          <p className="text-4xl font-bold text-green-600">18</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Interviews This Week</h2>
          <p className="text-4xl font-bold text-orange-600">7</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        {/* Add a table or list of recent applications here */}
      </div>
    </div>
  );
}
