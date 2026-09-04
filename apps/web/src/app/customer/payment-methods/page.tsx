"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { SavedPaymentMethodsList } from "../../../components/customer/SavedPaymentMethodsList";
import { AddPaymentMethodModal } from "../../../components/customer/AddPaymentMethodModal";
import { Button } from "../../../components/ui/button";

export default function CustomerPaymentMethodsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMethods = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await client.get("/payments/methods/all");
      setMethods(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load saved payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      await client.patch(`/payments/methods/${id}/default`);
      fetchMethods();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update default card");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this saved card?")) return;
    try {
      await client.delete(`/payments/methods/${id}`);
      fetchMethods();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove payment method");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Payment Methods</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your tokenized credit cards for instant 1-click booking checkout.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          + Add New Card
        </Button>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          Loading payment methods...
        </div>
      ) : methods.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-xs text-gray-500">No saved payment methods found.</p>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            Add Your First Payment Card
          </Button>
        </div>
      ) : (
        <SavedPaymentMethodsList
          methods={methods}
          onSetDefault={handleSetDefault}
          onDelete={handleDelete}
        />
      )}

      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMethods}
      />
    </div>
  );
}
