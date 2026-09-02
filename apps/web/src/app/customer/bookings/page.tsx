"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { CustomerBookingsTable, BookingItem } from "../../../components/customer/CustomerBookingsTable";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await client.post(`/bookings/${bookingId}/cancel`, {
        reason: "Customer cancelled from bookings page",
      });
      fetchBookings();
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
        <h2 className="text-xl font-bold text-gray-900">My Bookings Management</h2>
        <p className="text-xs text-gray-500 mt-1">View, track, and manage all your scheduled service reservations.</p>
      </div>

      <CustomerBookingsTable bookings={bookings} onCancelBooking={handleCancelBooking} />
    </div>
  );
}
