"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { AdminStatsGrid, AdminStats } from "../../../components/admin/AdminStatsGrid";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsersCount: 0,
    totalCustomersCount: 0,
    totalProvidersCount: 0,
    verifiedProvidersCount: 0,
    pendingProvidersCount: 0,
    totalBookingsCount: 0,
    platformGrossVolume: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .get("/admin/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load analytics", err))
      .finally(() => setIsLoading(false));
  }, []);

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
        <h2 className="text-xl font-bold text-gray-900">Platform Revenue & Performance Analytics</h2>
        <p className="text-xs text-gray-500 mt-1">Deep dive into gross transaction volume, active providers, and customer growth.</p>
      </div>

      <AdminStatsGrid stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-2">Revenue Breakdown</h3>
          <p className="text-xs text-gray-500 mb-4">Total platform GMV calculated from completed bookings.</p>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-xs text-emerald-700 font-semibold uppercase">Gross Transaction Volume</span>
            <p className="text-3xl font-extrabold text-emerald-900 mt-1">${stats.platformGrossVolume.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-2">Provider Onboarding Ratio</h3>
          <p className="text-xs text-gray-500 mb-4">Verified active partners vs pending applications.</p>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-600">Verified Providers:</span>
              <span className="text-green-700 font-bold">{stats.verifiedProvidersCount}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-600">Pending Review:</span>
              <span className="text-amber-700 font-bold">{stats.pendingProvidersCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
