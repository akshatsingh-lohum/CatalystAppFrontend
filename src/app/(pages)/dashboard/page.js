"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";

const Dashboard = ({ userRole }) => {
  const [showCumulative, setShowCumulative] = useState(false);

  const monthlyData = [
    { month: "Jan", requests: 100, completions: 80 },
    { month: "Feb", requests: 120, completions: 90 },
    { month: "Mar", requests: 150, completions: 120 },
    { month: "Apr", requests: 130, completions: 110 },
    { month: "May", requests: 160, completions: 140 },
  ];

  const cumulativeData = monthlyData.reduce((acc, curr) => {
    const last = acc[acc.length - 1] || {
      cumulativeRequests: 0,
      cumulativeCompletions: 0,
    };
    acc.push({
      month: curr.month,
      cumulativeRequests: last.cumulativeRequests + curr.requests,
      cumulativeCompletions: last.cumulativeCompletions + curr.completions,
    });
    return acc;
  }, []);

  const lotsFunnelData = [
    { stage: "Request", value: 5000 },
    { stage: "Security Check", value: 4700 },
    { stage: "Warehouse", value: 4500 },
    { stage: "Incineration", value: 4200 },
    { stage: "Vault", value: 4000 },
    { stage: "Production", value: 3800 },
    { stage: "Dispatch", value: 3500 },
    { stage: "Completed", value: 3200 },
  ];

  const materialWeightData = [
    { name: "Raw Material", weight: 10000 },
    { name: "Processed", weight: 9500 },
    { name: "Final Product", weight: 9000 },
  ];

  const StatCard = ({ title, value }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Welcome,{" "}
        {userRole === "companyAdmin" ? "Company Admin" : "Dealer Admin"}
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Requests" value="2,345" />
        <StatCard
          title="Active Users"
          value={userRole === "companyAdmin" ? "1,234" : "123"}
        />
        <StatCard title="Completion Rate" value="92%" />
        <StatCard title="Revenue Growth" value="+12.5%" />
      </div>

      <Tabs defaultValue="requests" className="mt-6">
        <TabsList>
          <TabsTrigger value="requests">Requests Overview</TabsTrigger>
          <TabsTrigger value="lots">Lots Summary</TabsTrigger>
          <TabsTrigger value="material">Material Processing</TabsTrigger>
          <TabsTrigger value="insights">Additional Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Requests and Completions</CardTitle>
              <div className="flex items-center space-x-2">
                <span>Monthly</span>
                <Switch
                  checked={showCumulative}
                  onCheckedChange={setShowCumulative}
                />
                <span>Cumulative</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>
                      {showCumulative ? "Cumulative Requests" : "Requests"}
                    </TableHead>
                    <TableHead>
                      {showCumulative
                        ? "Cumulative Completions"
                        : "Completions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(showCumulative ? cumulativeData : monthlyData).map(
                    (row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>
                          {showCumulative
                            ? row.cumulativeRequests
                            : row.requests}
                        </TableCell>
                        <TableCell>
                          {showCumulative
                            ? row.cumulativeCompletions
                            : row.completions}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lots">
          <Card>
            <CardHeader>
              <CardTitle>Lots Processing Stages</CardTitle>
            </CardHeader>
            <CardContent>
              {lotsFunnelData.map((stage) => (
                <div key={stage.stage} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{stage.stage}</span>
                    <span>{stage.value}</span>
                  </div>
                  <Progress
                    value={(stage.value / lotsFunnelData[0].value) * 100}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="material">
          <Card>
            <CardHeader>
              <CardTitle>Material vs Weight Processed</CardTitle>
            </CardHeader>
            <CardContent>
              {materialWeightData.map((material) => (
                <div key={material.name} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{material.name}</span>
                    <span>{material.weight} kg</span>
                  </div>
                  <Progress
                    value={
                      (material.weight / materialWeightData[0].weight) * 100
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-1">
                  <span>On-time</span>
                  <span>85%</span>
                </div>
                <Progress value={85} />
                <div className="flex justify-between mb-1 mt-4">
                  <span>Delayed</span>
                  <span>15%</span>
                </div>
                <Progress value={15} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                {[
                  { name: "Equipment", utilization: 78 },
                  { name: "Labor", utilization: 85 },
                  { name: "Storage", utilization: 62 },
                ].map((resource) => (
                  <div key={resource.name} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>{resource.name}</span>
                      <span>{resource.utilization}%</span>
                    </div>
                    <Progress value={resource.utilization} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {userRole === "companyAdmin" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Company-wide Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Additional metrics specific to company-wide performance would go
              here.
            </p>
          </CardContent>
        </Card>
      )}

      {userRole === "dealerAdmin" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dealer-specific Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Dealer-specific metrics and performance indicators would be
              displayed here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
