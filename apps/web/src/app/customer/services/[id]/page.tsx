"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { client } from "../../../../lib/axios";
import { Button } from "../../../../components/ui/button";
import { RatingStars } from "../../../../components/ui/RatingStars";

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get(`/services/${resolvedParams.id}`)
      .then((res) => setService(res.data))
      .catch((err) => console.error("Failed to load service", err))
      .finally(() => setIsLoading(false));
  }, [resolvedParams.id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) {
      setError("Please select a date and time for the appointment");
      return;
    }

    setIsBooking(true);
    setError("");
    try {
      await client.post("/bookings", {
        serviceId: resolvedParams.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      alert("Booking confirmed successfully!");
      router.push("/customer/bookings");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to book service");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        Service listing not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {service.category?.name || "Professional Service"}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">{service.name}</h1>
            <p className="text-xs text-gray-500 mt-1">
              Offered by <span className="font-bold text-gray-800">{service.provider?.businessName || "Verified Provider"}</span>
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-3xl font-extrabold text-gray-900">${service.price?.toFixed(2)}</span>
            <p className="text-xs text-gray-400 mt-0.5">{service.duration} mins duration</p>
          </div>
        </div>

        <div className="py-6 border-b border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Service Description</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
          <div className="flex items-center space-x-2 pt-2">
            <RatingStars rating={4.9} />
            <span className="text-xs text-gray-500 font-medium">(24 verified customer reviews)</span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBook} className="pt-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Schedule Appointment</h3>

          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-semibold text-gray-700">Select Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <Button type="submit" disabled={isBooking} className="w-full sm:w-auto px-8">
            {isBooking ? "Confirming Booking..." : "Confirm Reservation"}
          </Button>
        </form>
      </div>
    </div>
  );
}
