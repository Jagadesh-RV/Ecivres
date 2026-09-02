"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ProviderApplicationsTable, PendingProviderItem } from "../../../components/admin/ProviderApplicationsTable";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<PendingProviderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/providers");
      setProviders(res.data || []);
    } catch (err) {
      console.error("Failed to load providers", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await client.patch(`/admin/providers/${id}/approve`);
      fetchProviders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve provider");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await client.patch(`/admin/providers/${id}/reject`);
      fetchProviders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject provider");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Provider Onboarding & Verification</h2>
        <p className="text-xs text-gray-500 mt-1">Review partner applications, verify business credentials, and grant marketplace publishing access.</p>
      </div>

      <ProviderApplicationsTable
        providers={providers}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
