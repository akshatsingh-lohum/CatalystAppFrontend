"use client";

import React, { useState } from "react";

// Enum for stages
const STAGE = {
  REQUEST: "REQUEST",
  SECURITY_CHECK: "SECURITY_CHECK",
  WAREHOUSE: "WAREHOUSE",
  INCINERATION: "INCINERATION",
  VAULT: "VAULT",
  PRODUCTION: "PRODUCTION",
  DISPATCH: "DISPATCH",
  REQUEST_COMPLETE: "REQUEST_COMPLETE",
};

// Dummy data for requests in different stages
const dummyRequests = [
  { id: 1, lotId: "LOT001", status: "PROCESSING", stage: STAGE.REQUEST },
  { id: 2, lotId: "LOT002", status: "PROCESSING", stage: STAGE.SECURITY_CHECK },
  { id: 3, lotId: "LOT003", status: "PROCESSING", stage: STAGE.WAREHOUSE },
  { id: 4, lotId: "LOT004", status: "PROCESSING", stage: STAGE.INCINERATION },
  { id: 5, lotId: "LOT005", status: "PROCESSING", stage: STAGE.VAULT },
  { id: 6, lotId: "LOT006", status: "PROCESSING", stage: STAGE.PRODUCTION },
  { id: 7, lotId: "LOT007", status: "PROCESSING", stage: STAGE.DISPATCH },
  {
    id: 8,
    lotId: "LOT008",
    status: "COMPLETED",
    stage: STAGE.REQUEST_COMPLETE,
  },
  {
    id: 9,
    lotId: "LOT009",
    status: "COMPLETED",
    stage: STAGE.REQUEST_COMPLETE,
  },
];

const DashboardPage = ({ company, dealer }) => {
  const [stageFilter, setStageFilter] = useState("ALL");

  const companyName = company ? company.companyName : "FIX THIS";
  const dealerName = dealer ? dealer.name : "FIX THIS";

  const totalRequests = dummyRequests.length;
  const completedRequests = dummyRequests.filter(
    (req) => req.status === "COMPLETED"
  ).length;

  const stageCounts = Object.values(STAGE).reduce((acc, stage) => {
    acc[stage] = dummyRequests.filter((req) => req.stage === stage).length;
    return acc;
  }, {});

  const filteredRequests =
    stageFilter === "ALL"
      ? dummyRequests
      : dummyRequests.filter((req) => req.stage === stageFilter);

  const FunnelBar = ({ stage, count, maxCount }) => {
    const percentage = (count / maxCount) * 100;
    return (
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{stage}</span>
          <span className="text-sm font-medium text-gray-700">{count}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-1 w-full">
      <div className="flex mb-8">
        <div className="w-2/3 bg-white shadow-md rounded-lg p-6 mr-4">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <div className="grid grid-cols-4 gap-2 text-gray-600">
            <div>
              <p className="font-semibold">Company</p>
              <p>{companyName}</p>
            </div>
            <div>
              <p className="font-semibold">Dealer</p>
              <p>{dealerName}</p>
            </div>
            <div>
              <p className="font-semibold">Total Requests</p>
              <p className="text-xl font-bold text-blue-500">{totalRequests}</p>
            </div>
            <div>
              <p className="font-semibold">Completed Requests</p>
              <p className="text-xl font-bold text-green-500">
                {completedRequests}
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/3 flex items-center justify-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Add New Request
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/4 bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Request Funnel
          </h2>
          <div className="space-y-8">
            {Object.entries(stageCounts).map(([stage, count]) => (
              <FunnelBar
                key={stage}
                stage={stage}
                count={count}
                maxCount={totalRequests}
              />
            ))}
          </div>
        </div>

        <div className="w-3/4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Requests</h2>
              <select
                className="border rounded-md px-2 py-1"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="ALL">All Stages</option>
                {Object.values(STAGE).map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Lot ID</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Stage</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="p-2">{request.lotId}</td>
                    <td className="p-2">{request.status}</td>
                    <td className="p-2">{request.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
