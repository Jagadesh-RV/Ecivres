"use client";

import React, { useState } from "react";

interface ServiceCompletionDialogProps {
  isOpen: boolean;
  bookingId: string;
  serviceName?: string;
  onClose: () => void;
  onConfirmCompletion: (bookingId: string, notes?: string) => Promise<void>;
}

export const ServiceCompletionDialog: React.FC<ServiceCompletionDialogProps> = ({
  isOpen,
  bookingId,
  serviceName,
  onClose,
  onConfirmCompletion,
}) => {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmCompletion(bookingId, notes);
      onClose();
    } catch (err) {
      console.error("Completion failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Confirm Service Completion</h3>
            <p className="text-xs text-gray-500">{serviceName || `Booking ID: ${bookingId}`}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 rounded-lg hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
            <span className="font-bold block mb-1">Service Fulfillment Verification</span>
            Marking this booking as completed will confirm service delivery, update payout balance, and trigger review eligibility.
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Completion Notes / Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed all requested repair tasks and verified operational status."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {submitting ? "Processing..." : "Confirm & Complete Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
