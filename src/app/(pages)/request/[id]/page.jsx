"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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

const stageFieldsMap = {
  REQUEST: [
    "lotWeightKg",
    "catalystName",
    "catalystPercent",
    "catalystWeight",
    "notes",
    "createdAt",
  ],
  SECURITY_CHECK: ["notes", "updatedAt"],
  WAREHOUSE: ["lotWeightKg", "clientApproved", "notes", "updatedAt"],
  INCINERATION: ["catalysWeight", "custApproved", "clientApproved", "notes"],
  VAULT: ["status", "notes"],
  PRODUCTION: ["status", "lossPercent", "notes", "updatedAt"],
  DISPATCH: ["lotWeightKg", "status", "dispatchNo", "notes", "updatedAt"],
  REQUEST_COMPLETE: [
    "status",
    "notes",
    "updatedAt",
    "clientAcknowledged",
    "paymentStatus",
  ],
};

const stages = Object.keys(STAGE);
const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

const RequestDetailPage = () => {
  const params = useParams();
  const lotID = params.id;

  const [lotStatus, setLotStatus] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [stageData, setStageData] = useState({});
  const [selectedStage, setSelectedStage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!lotID) {
        setError("Lot ID is undefined");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch LotStatus
        const lotStatusResponse = await fetch(
          `${backendUrl}/lotStatus/${lotID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch Request data using lotID
        const requestResponse = await fetch(`${backendUrl}/request/${lotID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!lotStatusResponse.ok || !requestResponse.ok) {
          throw new Error(
            "HTTP error! status: " + lotStatusResponse.status ||
              requestResponse.status
          );
        }

        const [lotStatusData, requestData] = await Promise.all([
          lotStatusResponse.json(),
          requestResponse.json(),
        ]);

        setLotStatus(lotStatusData);
        setRequestData(requestData);

        // Determine the current stage index
        const currentStageIndex = stages.indexOf(lotStatusData.stage);

        // Fetch data only for completed stages and the current stage
        const completedStages = stages.slice(0, currentStageIndex);

        const stageDataPromises = completedStages.map((stage) => {
          if (stage === "REQUEST") {
            return Promise.resolve(requestData);
          } else {
            return fetch(
              `${backendUrl}/utilizeApp/${stage
                .toLowerCase()
                .replace(/_/g, "-")}/${lotID}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ).then((response) => response.json());
          }
        });

        const allStageData = await Promise.all(stageDataPromises);

        const stageDataMap = completedStages.reduce((acc, stage, index) => {
          acc[stage] = allStageData[index];
          return acc;
        }, {});

        console.log(
          "Stage Data Map:",
          stageDataMap,
          "type",
          typeof stageDataMap
        );

        setStageData(stageDataMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lotID, selectedStage]);

  const formatFieldName = (name) => {
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  const formatFieldValue = (value) => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "number") return value.toString();
    if (typeof value === "object" && value !== null) {
      if (value.companyName) return value.companyName;
      if (value.name) return value.name;
    }
    return value;
  };

  const renderStageDetails = () => {
    if (!selectedStage) return <p>Select a stage to view details</p>;

    const data = stageData[selectedStage];
    if (!data) return <p>No data available for this stage</p>;

    const fieldsToRender = stageFieldsMap[selectedStage];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldsToRender.map((field) => {
          if (data.hasOwnProperty(field)) {
            return (
              <div key={field} className="mb-2">
                <p className="font-semibold">{formatFieldName(field)}:</p>
                <p>{formatFieldValue(data[field])}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!lotStatus || !requestData) return <div>No data available</div>;

  return (
    <div className="flex flex-col p-4 bg-gray-100 min-h-screen">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-md font-semibold">Company</p>
              <p>{requestData.company?.companyName || "N/A"}</p>
            </div>
            <div>
              <p className="text-md font-semibold">Dealer</p>
              <p>{requestData.dealer?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-md font-semibold">Lot ID</p>
              <p className="text-primary">{lotStatus.lotID}</p>
            </div>
            <div>
              <p className="text-md font-semibold">Current Stage</p>
              <p className="text-green-500">{STAGE[lotStatus.stage]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Stage Progress */}
        <Card className="w-full md:w-1/4">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Stage Progress</h3>
            {stages.map((stage) => {
              const isCompleted = stageData.hasOwnProperty(stage);
              return (
                <div
                  key={stage}
                  className={`mb-4 cursor-pointer flex justify-between items-center p-2 rounded ${
                    selectedStage === stage
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => isCompleted && setSelectedStage(stage)}
                >
                  <span>{STAGE[stage]}</span>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Stage Details */}
        <Card className="flex-grow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedStage ? STAGE[selectedStage] : "Select a stage"}
            </h3>
            <div className="mt-4">{renderStageDetails()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestDetailPage;
