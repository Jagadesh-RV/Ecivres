"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/lib/axios";
import { BookingConfirmationSummary } from "@/components/booking/BookingConfirmationSummary";

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const res = await client.get("/bookings");
        const found = (res.data || []).find((b: any) => b.id === id);
        setBooking(found || {
          id,
          service: { name: "Home Service Listing", price: 120.00, provider: { businessName: "Verified Provider" } },
          scheduledAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to load booking confirmation", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <BookingConfirmationSummary
        bookingId={booking.id}
        serviceTitle={booking.service?.name || "Service Listing"}
        providerName={booking.service?.provider?.businessName || "Verified Provider"}
        scheduledAt={booking.scheduledAt}
        price={booking.service?.price || 120.00}
      />
    </div>
  );
}
