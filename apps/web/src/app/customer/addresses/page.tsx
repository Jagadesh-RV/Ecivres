"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { AddressCard } from "../../../components/customer/AddressCard";
import { AddAddressModal } from "../../../components/customer/AddAddressModal";
import { Button } from "../../../components/ui/button";

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAddresses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await client.get("/users/addresses");
      setAddresses(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load saved addresses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      await client.delete(`/users/addresses/${id}`);
      fetchAddresses();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your service locations and delivery addresses.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          + Add New Address
        </Button>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          Loading saved addresses...
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-xs text-gray-500">No saved addresses found.</p>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            Add Your First Location
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAddresses}
      />
    </div>
  );
}
