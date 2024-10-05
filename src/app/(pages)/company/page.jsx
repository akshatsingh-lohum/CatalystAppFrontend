"use client";

import { useAuth } from "../../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataGrid } from "@mui/x-data-grid";
import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated, isLoading: authLoading, getToken } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCompanies();
    }
  }, [isAuthenticated, authLoading]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company data");
      }

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        companyName: company.companyName,
      });
    } else {
      setEditingCompany(null);
      setFormData({
        companyName: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
    setFormData({
      companyName: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = getToken();
      const url = editingCompany
        ? `${apiUrl}/company/${editingCompany.id}`
        : `${apiUrl}/company`;
      const method = editingCompany ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save company data");
      }

      await fetchCompanies();
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${apiUrl}/company/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      await fetchCompanies();
    } catch (error) {
      setError(error.message);
    }
  };

  const columns = [
    { field: "companyName", headerName: "Company Name", flex: 1 },
    {
      field: "companyCreatedAt",
      headerName: "Created At",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "companyUpdatedAt",
      headerName: "Updated At",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center justify-center space-x-2 h-full w-full">
          <Button onClick={() => handleOpenDialog(params.row)} size="sm">
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(params.row.id)}
            variant="destructive"
            size="sm"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!isAuthenticated) return <div>Please log in to view companies</div>;

  return (
    <div className="flex flex-col p-4 bg-gray-100 h-full">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-md">Total Companies</p>
              <p className="text-primary">{companies.length}</p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Button size="sm" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card className="flex-grow overflow-auto">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Companies</h3>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/3"
            />
          </div>
          <DataGrid
            rows={filteredCompanies}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6, 10, 15]}
            disableSelectionOnClick
          />
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "Edit Company" : "Add Company"}
            </DialogTitle>
            <DialogDescription>
              Enter the details of the company below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="companyName" className="text-right">
                Company Name
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDialog} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCompany ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyPage;
