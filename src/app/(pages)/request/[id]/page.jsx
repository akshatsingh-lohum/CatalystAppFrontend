"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const stages = Object.keys(STAGE);
const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

const RequestDetailPage = () => {
  const { id } = useParams();
  const [lotDetails, setLotDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [stageStatus, setStageStatus] = useState({});
  const [selectedStage, setSelectedStage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const [lotResponse, companyResponse] = await Promise.all([
          fetch(`${backendUrl}/lotStatus/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${backendUrl}/other/fetchLot/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!lotResponse.ok || !companyResponse.ok) {
          throw new Error(
            `HTTP error! status: ${
              lotResponse.status || companyResponse.status
            }`
          );
        }

        const [lotData, companyData] = await Promise.all([
          lotResponse.json(),
          companyResponse.json(),
        ]);

        setLotDetails(lotData);
        setCompanyDetails(companyData);
        updateStageStatus(lotData.stage);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateStageStatus = (currentStage) => {
    const updatedStatus = {};
    const currentStageIndex = stages.indexOf(currentStage) - 1;

    stages.forEach((stage, index) => {
      updatedStatus[stage] = index <= currentStageIndex;
    });
    setStageStatus(updatedStatus);
  };

  const renderStageDetails = () => {
    if (!selectedStage) return <p>Select a stage to view details</p>;

    // This is a placeholder. You should implement actual logic to display
    // relevant information for each stage based on your application's requirements.
    return (
      <div>
        <p>{stageStatus[selectedStage] ? "" : "Status: Pending"}</p>
        {/* Add more stage-specific details here */}
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
  if (!lotDetails || !companyDetails) return <div>No data available</div>;

  const completedStages = Object.values(stageStatus).filter(Boolean).length;
  const lotID = lotDetails.lotID;

  return (
    <div className="flex flex-col p-4 bg-gray-100 min-h-screen">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-md font-semibold">Company</p>
              <p>{companyDetails.company || "N/A"}</p>
            </div>
            <div>
              <p className="text-md font-semibold">Dealer</p>
              <p>{companyDetails.dealer || "N/A"}</p>
            </div>
            <div>
              <p className="text-md font-semibold">Lot ID</p>
              <p className="text-primary">{lotID}</p>
            </div>
            <div>
              <p className="text-md font-semibold">Completed Stages</p>
              <p className="text-green-500">
                {completedStages} / {stages.length}
              </p>
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
            {stages.map((stage) => (
              <div
                key={stage}
                className={`mb-4 cursor-pointer flex justify-between items-center p-2 rounded ${
                  selectedStage === stage ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
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
        <Card className="flex-grow">
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

export default RequestDetailPage;
