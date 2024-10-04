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
import { useState } from "react";

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

const dummyRequests = [
  {
    id: 1,
    lotId: "LOT001",
    status: "Processing",
    stage: STAGE.REQUEST,
    requestRaiseDate: "2021-10-01",
  },
  {
    id: 2,
    lotId: "LOT002",
    status: "Processing",
    stage: STAGE.SECURITY_CHECK,
    requestRaiseDate: "2021-10-01",
  },
  {
    id: 3,
    lotId: "LOT003",
    status: "Processing",
    stage: STAGE.WAREHOUSE,
    requestRaiseDate: "2021-10-01",
  },
  {
    id: 8,
    lotId: "LOT008",
    status: "Completed",
    stage: STAGE.REQUEST_COMPLETE,
    requestRaiseDate: "2021-10-04",
  },
];

const columns = [
  { field: "lotId", headerName: "Lot ID", width: 130 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "stage", headerName: "Stage", width: 200 },
  { field: "requestRaiseDate", headerName: "Request Raise Date", width: 200 },
];

const DashboardPage = ({ company, dealer }) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stageFilter, setStageFilter] = useState("ALL");

  const totalRequests = dummyRequests.length;
  const completedRequests = dummyRequests.filter(
    (req) => req.status === "Completed"
  ).length;

  const stageCounts = Object.values(STAGE).reduce((acc, stage) => {
    acc[stage] = dummyRequests.filter((req) => req.stage === stage).length;
    return acc;
  }, {});

  const filteredRequests = dummyRequests.filter(
    (request) =>
      (statusFilter === "ALL" || request.status === statusFilter) &&
      (stageFilter === "ALL" || request.stage === stageFilter)
  );

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
              <p className="text-md">Total Requests</p>
              <p className="text-primary">{totalRequests}</p>
            </div>
            <div>
              <p className="text-md">Completed Requests</p>
              <p className="text-green-500">{completedRequests}</p>
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
              <Select onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
            <DataGrid rows={filteredRequests} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
