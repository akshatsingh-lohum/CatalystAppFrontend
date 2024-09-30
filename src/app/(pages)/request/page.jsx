"use client";

import React, { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

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

const stageStatus = {
  REQUEST: true,
  SECURITY_CHECK: true,
  WAREHOUSE: false,
  INCINERATION: false,
  VAULT: false,
  PRODUCTION: false,
  DISPATCH: false,
  REQUEST_COMPLETE: false,
}; // FIX THIS

const RequestPage = ({ lotId, company, dealer }) => {
  const [selectedStage, setSelectedStage] = useState(null);

  const stages = Object.values(STAGE);

  const companyName = company ? company.companyName : "FIX THIS";
  const dealerName = dealer ? dealer.name : "FIX THIS";

  const renderStageDetails = () => {
    switch (selectedStage) {
      case STAGE.REQUEST:
        return <RequestDetails lotId={lotId} />;
      case STAGE.SECURITY_CHECK:
        return <SecurityCheckDetails lotId={lotId} />;
      case STAGE.WAREHOUSE:
        return <WarehouseDetails lotId={lotId} />;
      case STAGE.INCINERATION:
        return <IncinerationDetails lotId={lotId} />;
      case STAGE.VAULT:
        return <VaultDetails lotId={lotId} />;
      case STAGE.PRODUCTION:
        return <ProductionDetails lotId={lotId} />;
      case STAGE.DISPATCH:
        return <DispatchDetails lotId={lotId} />;
      case STAGE.REQUEST_COMPLETE:
        return <RequestCompleteDetails lotId={lotId} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-1 w-2/3">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Lot #{lotId}</h1>
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          <div>
            <p className="font-semibold">Company</p>
            <p>{companyName}</p>
          </div>
          <div>
            <p className="font-semibold">Dealer</p>
            <p>{dealerName}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 h-full">
        <div className="w-1/3 shadow-md flex-1 min-h-full">
          <h2 className="text-l font-semibold text-gray-500 mb-6">Timeline</h2>
          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div
                key={stage}
                className={`flex items-center cursor-pointer p-4 bg-white rounded-lg transition-all duration-200 ${
                  selectedStage === stage
                    ? "ring-2 ring-blue-500"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedStage(stage)}
              >
                {stageStatus[stage] ? (
                  <CheckCircle className="w-3 h-3 text-green-500 mr-4" />
                ) : (
                  <Circle className="w-3 h-3 text-yellow-500 mr-4" />
                )}
                <span className="text-md font-medium text-gray-700">
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 min-h-full">
          <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex flex-col">
            <div className="bg-gray-800 text-white py-4 px-6">
              <h3 className="text-xl font-semibold">
                {selectedStage || "Select a stage"}
              </h3>
            </div>
            <div className="p-6">{renderStageDetails()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequestDetails = ({ lotId }) => (
  <div>Request details for lot {lotId}</div>
);
const SecurityCheckDetails = ({ lotId }) => (
  <div>Security check details for lot {lotId}</div>
);
const WarehouseDetails = ({ lotId }) => (
  <div>Warehouse details for lot {lotId}</div>
);
const IncinerationDetails = ({ lotId }) => (
  <div>Incineration details for lot {lotId}</div>
);
const VaultDetails = ({ lotId }) => <div>Vault details for lot {lotId}</div>;
const ProductionDetails = ({ lotId }) => (
  <div>Production details for lot {lotId}</div>
);
const DispatchDetails = ({ lotId }) => (
  <div>Dispatch details for lot {lotId}</div>
);
const RequestCompleteDetails = ({ lotId }) => (
  <div>Request complete details for lot {lotId}</div>
);

export default RequestPage;
