"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { client } from "../../../../../lib/axios";
import { BookingTimeline, BookingLifecycleStatus } from "../../../../../components/bookings/BookingTimeline";

export default function CustomerBookingStatusPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await client.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Booking not found.</p>
        <button
          onClick={() => router.push("/customer/bookings")}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/customer/bookings")}
            className="text-xs text-gray-500 hover:text-gray-900 mb-2 block"
          >
            ← Back to My Bookings
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Booking Status Tracker</h1>
          <p className="text-xs text-gray-500">ID: {booking.id}</p>
        </div>
      </div>

      <BookingTimeline currentStatus={booking.status as BookingLifecycleStatus} />

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Booking Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-500 block">Service</span>
            <span className="font-bold text-gray-900 text-sm">{booking.service?.name || "Service"}</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-500 block">Scheduled Time</span>
            <span className="font-bold text-gray-900 text-sm">
              {new Date(booking.scheduledAt).toLocaleString()}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-500 block">Total Amount</span>
            <span className="font-bold text-emerald-700 text-sm">
              ${booking.service?.price?.toFixed(2) || "0.00"}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-500 block">Current Status</span>
            <span className="font-bold uppercase text-indigo-600 text-sm">{booking.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
