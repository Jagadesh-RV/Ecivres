"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ProviderBookingsTable, ProviderBookingItem } from "../../../components/provider/ProviderBookingsTable";

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<ProviderBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/bookings/provider");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load provider bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await client.patch(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
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
        <h2 className="text-xl font-bold text-gray-900">Client Bookings Management</h2>
        <p className="text-xs text-gray-500 mt-1">Review incoming booking requests, confirm schedules, and complete jobs.</p>
      </div>

      <ProviderBookingsTable bookings={bookings} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
