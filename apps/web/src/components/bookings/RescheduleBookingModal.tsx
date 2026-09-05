"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { Button } from "../ui/button";

interface RescheduleBookingModalProps {
  bookingId: string;
  serviceName: string;
  currentDate?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RescheduleBookingModal: React.FC<RescheduleBookingModalProps> = ({
  bookingId,
  serviceName,
  currentDate,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [scheduledAt, setScheduledAt] = useState(
    currentDate ? new Date(currentDate).toISOString().slice(0, 16) : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await client.patch(`/bookings/${bookingId}/reschedule`, {
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reschedule booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Reschedule Booking</h3>
            <p className="text-xs text-gray-500">{serviceName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Select New Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
