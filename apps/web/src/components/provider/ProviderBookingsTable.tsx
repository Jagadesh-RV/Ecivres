"use client";

import React, { useState } from "react";
import { Badge } from "../ui/badge";

export interface ProviderBookingItem {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  service?: {
    name: string;
    price: number;
  };
  customer?: {
    user?: {
      email: string;
    };
    firstName?: string;
    lastName?: string;
  };
}

interface ProviderBookingsTableProps {
  bookings: ProviderBookingItem[];
  onUpdateStatus?: (id: string, status: string) => void;
}

export const ProviderBookingsTable: React.FC<ProviderBookingsTableProps> = ({
  bookings,
  onUpdateStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
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
        <h3 className="text-base font-bold text-gray-900">Client Booking Requests</h3>
        <div className="flex items-center flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No client bookings found for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-semibold">Service</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Customer Email</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Scheduled Time</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Revenue</th>
                <th className="px-4 sm:px-6 py-3 font-semibold">Status</th>
                <th className="px-4 sm:px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-semibold text-gray-900">
                    {b.service?.name || "Service Listing"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600">
                    {b.customer?.user?.email || "Customer"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600">
                    {new Date(b.scheduledAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-bold text-gray-900">
                    ${b.service?.price?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Badge label={b.status} variant={getBadgeVariant(b.status)} />
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right space-x-2">
                    {b.status === "PENDING" && onUpdateStatus && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(b.id, "CONFIRMED")}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onUpdateStatus(b.id, "CANCELLED")}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {b.status === "CONFIRMED" && onUpdateStatus && (
                      <button
                        onClick={() => onUpdateStatus(b.id, "COMPLETED")}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
                      >
                        Mark Completed
                      </button>
                    )}
                    {b.status === "COMPLETED" && (
                      <span className="text-xs font-semibold text-emerald-600">Payout Credited</span>
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
