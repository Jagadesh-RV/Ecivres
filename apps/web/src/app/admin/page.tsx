"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../lib/axios";
import { AdminStatsGrid, AdminStats } from "../../components/admin/AdminStatsGrid";
import { ProviderApplicationsTable, PendingProviderItem } from "../../components/admin/ProviderApplicationsTable";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsersCount: 0,
    totalCustomersCount: 0,
    totalProvidersCount: 0,
    verifiedProvidersCount: 0,
    pendingProvidersCount: 0,
    totalBookingsCount: 0,
    platformGrossVolume: 0,
  });
  const [pendingProviders, setPendingProviders] = useState<PendingProviderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/admin/dashboard-stats");
      setStats(res.data);
      setPendingProviders(res.data.pendingApplications || []);
    } catch (err) {
      console.error("Failed to load admin dashboard stats", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await client.patch(`/admin/providers/${id}/approve`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve provider");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await client.patch(`/admin/providers/${id}/reject`);
      fetchData();
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
        <h2 className="text-xl font-bold text-gray-900">Platform Governance & Metrics</h2>
        <p className="text-xs text-gray-500 mt-1">Monitor system performance, user activity, and pending provider onboarding applications.</p>
      </div>

      <AdminStatsGrid stats={stats} />

      <ProviderApplicationsTable
        providers={pendingProviders}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
