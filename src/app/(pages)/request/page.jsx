"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataGrid } from "@mui/x-data-grid";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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

// createdAt

const LotIdLink = ({ value, row }) => (
  <Link href={`/request/${row.id}`} className="text-blue-600 hover:underline">
    {value}
  </Link>
);

const columns = [
  {
    field: "lotID",
    headerName: "Lot ID",
    flex: 1,
    renderCell: (params) => <LotIdLink {...params} />,
  },
  { field: "stage", headerName: "Stage", flex: 1 },
  { field: "createdAt", headerName: "Request Raise Date", flex: 1 },
];

const RequestPage = ({ company, dealer }) => {
  const [stageFilter, setStageFilter] = useState("ALL");
  const [userDetails, setUserDetails] = useState(null);
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
    const token = localStorage.getItem("token");
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/other/detailsFromJwt`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        console.log(
          `Page: request/[id]/page.jsx data: Company ${data.companyId} , ${data.companyName}, Dealer - ${data.dealerId} , ${data.dealerName}`
        );
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${backendUrl}/lotStatus`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        console.log("Page: request/[id]/page.jsx data: ", data);
        setAllRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const totalRequests = allRequests.length;
  console.log("All Requests:", allRequests);

  const completedRequestsCount = allRequests.filter(
    (req) => req.status === "COMPLETED"
  ).length;

  const stageCounts = Object.values(STAGE).reduce((acc, stage) => {
    acc[stage] = allRequests.filter((req) => req.stage === stage).length;
    return acc;
  }, {});

  const filteredRequests = allRequests.filter(
    (request) => stageFilter === "ALL" || request.stage === stageFilter
  );

  return (
    <div className="flex flex-col p-4 bg-gray-100 h-full">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-md">Company</p>
              <p>{userDetails?.companyName || "N/A"}</p>
            </div>
            <div>
              <p className="text-md">Dealer</p>
              <p>{userDetails?.dealerName || "N/A"}</p>
            </div>
            <div>
              <p className="text-md">Total Requests</p>
              <p className="text-primary">{totalRequests}</p>
            </div>
            <div>
              <p className="text-md">Completed Requests</p>
              <p className="text-green-500">{completedRequestsCount}</p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Lot Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Funnel Section */}
      <div className="flex gap-6">
        <Card className="w-1/4 overflow-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lot Funnel</h3>
            {Object.entries(stageCounts).map(([stage, count]) => (
              <div key={stage} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{stage}</span>
                  <span>{count}</span>
                </div>
                <Progress
                  value={(count / totalRequests) * 100}
                  className="h-3"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Grid */}
        <Card className="flex-grow overflow-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lots</h3>
            <div className="flex justify-end gap-4 mb-4">
              <Select onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  {Object.values(STAGE).map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid rows={filteredRequests} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestPage;
