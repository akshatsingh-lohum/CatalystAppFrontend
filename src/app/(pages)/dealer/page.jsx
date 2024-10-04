"use client";

import { useAuth } from "../../../hooks/useAuth";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";

const DealerManagement = () => {
  const [dealers, setDealers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    companyId: "",
  });
  const { isAuthenticated, isLoading: authLoading, getToken } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      fetchDealers();
      fetchCompanies();
    }
  }, [isAuthenticated, authLoading]);

  async function fetchDealers() {
    if (!isAuthenticated) {
      setError("You must be logged in to view dealers");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = getToken();
      const response = await fetch(`${apiUrl}/dealer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dealer data");
      }

      const data = await response.json();
      setDealers(data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCompanies() {
    // Similar to fetchDealers, but for companies
    // This is needed to populate the company selection in the form
  }

  const handleOpenDialog = (dealer = null) => {
    if (dealer) {
      setEditingDealer(dealer);
      setFormData({
        name: dealer.name,
        email: dealer.email || "",
        phone: dealer.phone || "",
        address: dealer.address || "",
        companyId: dealer.companyId,
      });
    } else {
      setEditingDealer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        companyId: "",
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
      companyId: "",
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = getToken();
      const url = editingDealer
        ? `${apiUrl}/dealer/${editingDealer.id}`
        : `${apiUrl}/dealer`;
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
      console.error("Error saving dealer:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = getToken();
      const response = await fetch(`${apiUrl}/dealer/${id}`, {
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
      console.error("Error deleting dealer:", error);
      setError(error.message);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!isAuthenticated) return <div>Please log in to view dealers</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dealer Management</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Dealer
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dealers.map((dealer) => (
            <TableRow key={dealer.id}>
              <TableCell>{dealer.name}</TableCell>
              <TableCell>{dealer.email}</TableCell>
              <TableCell>{dealer.phone}</TableCell>
              <TableCell>{dealer.address}</TableCell>
              <TableCell>{dealer.companyId}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button onClick={() => handleOpenDialog(dealer)} size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(dealer.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

export default DealerManagement;
