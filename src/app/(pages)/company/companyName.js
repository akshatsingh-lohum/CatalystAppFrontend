// This file should be named CompanyPage.js
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
import { Plus, Users, Building, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

// Enum for user roles (matching the schema)
const USER_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  COMPANY_ADMIN: "COMPANY_ADMIN",
  DEALER_ADMIN: "DEALER_ADMIN",
  VIEWER: "VIEWER",
  DATA_UPLOAD: "DATA_UPLOAD",
  USER: "USER",
};

const userColumns = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "role", headerName: "Role", width: 150 },
  { field: "dealerId", headerName: "Dealer ID", width: 100 },
];

const dealerColumns = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
];

const CompanyPage = () => {
  const [company, setCompany] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyData, dealersData, usersData] = await Promise.all([
          fetch("/api/company").then((res) => res.json()),
          fetch("/api/dealers").then((res) => res.json()),
          fetch("/api/users").then((res) => res.json()),
        ]);

        setCompany(companyData);
        setDealers(dealersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>Error loading company data</div>;
  }

  const totalUsers = users.length;
  const totalDealers = dealers.length;

  const roleCounts = Object.values(USER_ROLE).reduce((acc, role) => {
    acc[role] = users.filter((user) => user.role === role).length;
    return acc;
  }, {});

  const filteredUsers = users.filter(
    (user) => roleFilter === "ALL" || user.role === roleFilter
  );

  return (
    <div className="flex flex-col p-4 bg-gray-100 h-full">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-md">Company Name</p>
              <p className="text-xl font-bold">{company.companyName}</p>
            </div>
            <div>
              <p className="text-md">Total Dealers</p>
              <p className="text-xl font-bold text-blue-500">{totalDealers}</p>
            </div>
            <div>
              <p className="text-md">Total Users</p>
              <p className="text-xl font-bold text-primary">{totalUsers}</p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Button size="sm" className="mr-2">
              <Plus className="mr-2 h-4 w-4" /> Add New User
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add New Dealer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Company Overview */}
        <Card className="w-1/4 overflow-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Company Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Building className="mr-2" />
                <span>Company ID: {company.id}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" />
                <span>
                  Created:{" "}
                  {new Date(company.companyCreatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" />
                <span>
                  Updated:{" "}
                  {new Date(company.companyUpdatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <h4 className="text-md font-semibold mt-6 mb-2">User Roles</h4>
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{role}</span>
                  <span>{count}</span>
                </div>
                <Progress value={(count / totalUsers) * 100} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Users and Dealers Data Grids */}
        <div className="flex-grow space-y-6">
          <Card className="overflow-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Dealers</h3>
              <DataGrid
                rows={dealers}
                columns={dealerColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
              />
            </CardContent>
          </Card>
          <Card className="overflow-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Users</h3>
              <div className="flex justify-end gap-4 mb-4">
                <Select onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    {Object.values(USER_ROLE).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DataGrid
                rows={filteredUsers}
                columns={userColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
