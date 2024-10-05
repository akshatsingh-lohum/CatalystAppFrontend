"use client";

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

const DealerPage = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/dealer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dealers. " + response.statusText);
      }

      const data = await response.json();
      setDealers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch companies. " + response.statusText);
      }

      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (dealer = null) => {
    if (dealer) {
      setEditingDealer(dealer);
      setFormData({
        name: dealer.name,
        email: dealer.email,
        phone: dealer.phone || "",
        address: dealer.address || "",
      });
    } else {
      setEditingDealer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDealer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
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
      const token = localStorage.getItem("token");
      const url = editingDealer
        ? `${backendUrl}/dealer/${editingDealer.id}`
        : `${backendUrl}/dealer`;
      const method = editingDealer ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save dealer data");
      }

      await fetchDealers();
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/dealer/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete dealer");
      }

      await fetchDealers();
    } catch (error) {
      setError(error.message);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
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

  const filteredDealers = dealers.filter(
    (dealer) =>
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col p-4 bg-gray-100 h-full">
      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-md">Total Dealers</p>
              <p className="text-primary">{dealers.length}</p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Button size="sm" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Dealer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dealers Table */}
      <Card className="flex-grow overflow-auto">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dealers</h3>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search dealers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/3"
            />
          </div>
          <DataGrid
            rows={filteredDealers}
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
              {editingDealer ? "Edit Dealer" : "Add Dealer"}
            </DialogTitle>
            <DialogDescription>
              Enter the details of the dealer below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
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
              {editingDealer ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealerPage;
