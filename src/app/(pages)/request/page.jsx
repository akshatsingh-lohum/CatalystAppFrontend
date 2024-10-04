"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import React, { useState } from "react";

const STAGE = {
  REQUEST: "Request",
  SECURITY_CHECK: "Security Check",
  WAREHOUSE: "Warehouse",
  INCINERATION: "Incineration",
  VAULT: "Vault",
  PRODUCTION: "Production",
  DISPATCH: "Dispatch",
  REQUEST_COMPLETE: "Request Complete",
};

const stageStatus = {
  Request: true,
  "Security Check": true,
  Warehouse: true,
  Incineration: false,
  Vault: false,
  Production: false,
  Dispatch: false,
  "Request Complete": false,
};

const RequestPage = ({ lotId, company, dealer }) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const stages = Object.values(STAGE);
  const completedStages = stages.filter((stage) => stageStatus[stage]).length;

  const renderStageDetails = () => {
    // ... (keep the existing renderStageDetails function)
  };

  return (
    <div className="flex flex-col p-4 bg-gray-100 h-full">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-md">Company</p>
              <p>{company?.companyName || "N/A"}</p>
            </div>
            <div>
              <p className="text-md">Dealer</p>
              <p>{dealer?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-md">Lot ID</p>
              <p className="text-primary">{lotId}</p>
            </div>
            <div>
              <p className="text-md">Completed Stages</p>
              <p className="text-green-500">
                {completedStages} / {stages.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Stage Progress */}
        <Card className="w-1/4 overflow-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Stage Progress</h3>
            {stages.map((stage) => (
              <div
                key={stage}
                className="mb-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 p-2 rounded"
                onClick={() => setSelectedStage(stage)}
              >
                <span>{stage}</span>
                {stageStatus[stage] ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stage Details */}
        <Card className="flex-grow overflow-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedStage || "Select a stage"}
            </h3>
            <div className="mt-4">{renderStageDetails()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestPage;
