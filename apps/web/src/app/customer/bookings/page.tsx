"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { CustomerBookingsTable, BookingItem } from "../../../components/customer/CustomerBookingsTable";
import { RescheduleBookingModal } from "../../../components/bookings/RescheduleBookingModal";
import { CancelBookingModal } from "../../../components/bookings/CancelBookingModal";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [reschedulingBooking, setReschedulingBooking] = useState<BookingItem | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<BookingItem | null>(null);

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

      <CustomerBookingsTable
        bookings={bookings}
        onRescheduleBooking={(b) => setReschedulingBooking(b)}
        onCancelBooking={(b) => setCancellingBooking(b)}
      />

      {reschedulingBooking && (
        <RescheduleBookingModal
          bookingId={reschedulingBooking.id}
          serviceName={reschedulingBooking.service?.name || "Service"}
          currentDate={reschedulingBooking.scheduledAt}
          isOpen={!!reschedulingBooking}
          onClose={() => setReschedulingBooking(null)}
          onSuccess={fetchBookings}
        />
      )}

      {cancellingBooking && (
        <CancelBookingModal
          bookingId={cancellingBooking.id}
          serviceName={cancellingBooking.service?.name || "Service"}
          isOpen={!!cancellingBooking}
          onClose={() => setCancellingBooking(null)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
}
