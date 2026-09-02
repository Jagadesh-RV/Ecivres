"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../lib/axios";
import { CustomerStatsGrid, CustomerStats } from "../../components/customer/CustomerStatsGrid";
import { UpcomingAppointments } from "../../components/customer/UpcomingAppointments";
import { CustomerBookingsTable, BookingItem } from "../../components/customer/CustomerBookingsTable";

export default function CustomerDashboardPage() {
  const [stats, setStats] = useState<CustomerStats>({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    unreadNotifications: 0,
    totalSpent: 0,
  });
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        client.get("/users/customer/dashboard-stats"),
        client.get("/bookings"),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      console.error("Failed to load customer dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await client.post(`/bookings/${bookingId}/cancel`, {
        reason: "Customer cancelled from dashboard",
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel booking");
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
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-xs text-gray-500 mt-1">Track your upcoming appointments, service history, and activity.</p>
      </div>

      <CustomerStatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CustomerBookingsTable bookings={bookings} onCancelBooking={handleCancelBooking} />
        </div>
        <div>
          <UpcomingAppointments bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
