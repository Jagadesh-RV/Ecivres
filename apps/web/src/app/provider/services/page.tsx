"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ProviderServicesTable, ProviderServiceItem } from "../../../components/provider/ProviderServicesTable";

export default function ProviderServicesPage() {
  const [services, setServices] = useState<ProviderServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/services");
      setServices(res.data || []);
    } catch (err) {
      console.error("Failed to load provider services", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service listing?")) return;
    try {
      await client.delete(`/services/${id}`);
      fetchServices();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete service");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Service Offerings</h2>
        <p className="text-xs text-gray-500 mt-1">Manage your active service catalog, pricing, and duration.</p>
      </div>

      <ProviderServicesTable services={services} onDeleteService={handleDeleteService} />
    </div>
  );
}
