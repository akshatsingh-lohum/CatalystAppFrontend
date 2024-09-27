// src/app/components/CompanyList.js
import { formatDistanceToNow } from "date-fns";

export default function CompanyList({ company }) {
  if (!company || company.length === 0) {
    return <div>No company found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {company.map((company) => (
        <div key={company.id} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{company.companyName}</h2>
          <p className="text-sm text-gray-600 mb-2">
            Status: {company.companyStatus}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Created: {formatDistanceToNow(new Date(company.companyCreatedAt))}{" "}
            ago
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Updated: {formatDistanceToNow(new Date(company.companyUpdatedAt))}{" "}
            ago
          </p>
          <div className="border-t pt-4">
            <p className="text-sm font-semibold">
              Dealers: {company.dealers.length}
            </p>
            <p className="text-sm font-semibold">
              Requests: {company.requests.length}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
