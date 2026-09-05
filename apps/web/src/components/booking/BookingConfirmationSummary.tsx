"use client";

import React from "react";
import { CheckCircle2, Calendar, Clock, DollarSign, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingConfirmationSummaryProps {
  bookingId: string;
  serviceTitle: string;
  providerName: string;
  scheduledAt: string;
  price: number;
}

export function BookingConfirmationSummary({
  bookingId,
  serviceTitle,
  providerName,
  scheduledAt,
  price,
}: BookingConfirmationSummaryProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 max-w-lg mx-auto text-center space-y-6 shadow-sm">
      <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Booking Confirmed!</h2>
        <p className="text-xs text-muted-foreground mt-1">Your reservation request has been dispatched to {providerName}.</p>
      </div>

      <div className="bg-muted/40 rounded-xl p-4 text-left space-y-3 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Booking ID</span>
          <span className="font-mono font-bold">#{bookingId}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Service</span>
          <span className="font-semibold">{serviceTitle}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Scheduled Time</span>
          <span className="font-semibold">{new Date(scheduledAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Cost</span>
          <span className="font-bold text-primary">${price.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link href="/customer/bookings" className="flex-1">
          <Button className="w-full">View My Bookings</Button>
        </Link>
        <Link href="/customer/services" className="flex-1">
          <Button variant="outline" className="w-full">Browse More Services</Button>
        </Link>
      </div>
    </div>
  );
}
