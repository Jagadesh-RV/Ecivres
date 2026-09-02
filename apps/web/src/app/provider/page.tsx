"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../lib/axios";
import { ProviderStatsGrid, ProviderStats } from "../../components/provider/ProviderStatsGrid";
import { ProviderBookingsTable, ProviderBookingItem } from "../../components/provider/ProviderBookingsTable";

export default function ProviderDashboardPage() {
  const [stats, setStats] = useState<ProviderStats>({
    activeServicesCount: 0,
    totalBookingsCount: 0,
    pendingBookingsCount: 0,
    totalEarnings: 0,
  });
  const [bookings, setBookings] = useState<ProviderBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        client.get("/providers/dashboard-stats"),
        client.get("/bookings/provider"),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      console.error("Failed to load provider dashboard stats", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await client.patch(`/bookings/${id}/status`, { status });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update booking status");
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
        <h2 className="text-xl font-bold text-gray-900">Provider Performance & Revenue</h2>
        <p className="text-xs text-gray-500 mt-1">Monitor real-time revenue, manage incoming client requests, and track service status.</p>
      </div>

      <ProviderStatsGrid stats={stats} />

      <ProviderBookingsTable bookings={bookings} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
