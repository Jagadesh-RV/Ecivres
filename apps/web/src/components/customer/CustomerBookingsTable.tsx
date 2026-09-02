"use client";

import React, { useState } from "react";
import { Badge } from "../ui/badge";

export interface BookingItem {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  service: {
    id: string;
    name: string;
    price: number;
    provider?: {
      businessName: string;
    };
  };
}

interface CustomerBookingsTableProps {
  bookings: BookingItem[];
  onCancelBooking?: (bookingId: string) => void;
}

export const CustomerBookingsTable: React.FC<CustomerBookingsTableProps> = ({
  bookings,
  onCancelBooking,
}) => {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "COMPLETED":
        return "primary";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-base font-bold text-gray-900">Service Bookings History</h3>
        <div className="flex items-center space-x-2">
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === st
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No bookings found for the selected status.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">Service</th>
                <th className="px-6 py-3 font-semibold">Provider</th>
                <th className="px-6 py-3 font-semibold">Scheduled Date</th>
                <th className="px-6 py-3 font-semibold">Price</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {b.service?.name || "Service"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {b.service?.provider?.businessName || "Service Provider"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(b.scheduledAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ${b.service?.price?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge label={b.status} variant={getBadgeVariant(b.status)} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(b.status === "PENDING" || b.status === "CONFIRMED") && onCancelBooking && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
