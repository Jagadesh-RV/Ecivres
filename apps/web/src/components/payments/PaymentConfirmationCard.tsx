"use client";

import React, { useState } from "react";

interface PaymentConfirmationCardProps {
  bookingId: string;
  amount: number;
  serviceName?: string;
  paymentStatus?: string;
  transactionId?: string;
  onMockPay?: (bookingId: string) => Promise<void>;
}

export const PaymentConfirmationCard: React.FC<PaymentConfirmationCardProps> = ({
  bookingId,
  amount,
  serviceName,
  paymentStatus = "PENDING",
  transactionId,
  onMockPay,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!onMockPay) return;
    setLoading(true);
    try {
      await onMockPay(bookingId);
    } catch (err) {
      console.error("Payment settlement error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isPaid = paymentStatus === "SUCCESS" || paymentStatus === "COMPLETED";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-md w-full">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">Payment Summary</h3>
          <p className="text-xs text-gray-500">{serviceName || `Booking ID: ${bookingId}`}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {isPaid ? "PAID" : "UNPAID"}
        </span>
      </div>

      <div className="my-6 space-y-2 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Service Amount:</span>
          <span className="font-semibold text-gray-900">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Platform Fee (0% demo):</span>
          <span className="font-semibold text-gray-900">$0.00</span>
        </div>
        <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
          <span>Total Charged:</span>
          <span className="text-emerald-700">${amount.toFixed(2)}</span>
        </div>
        {transactionId && (
          <div className="pt-2 text-[11px] text-gray-400 font-mono">
            TX: {transactionId}
          </div>
        )}
      </div>

      {!isPaid ? (
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Processing Mock Settlement...</span>
          ) : (
            <>
              <span>💳 Confirm & Settle Payment (${amount.toFixed(2)})</span>
            </>
          )}
        </button>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs text-emerald-800 font-semibold">
          ✓ Payment Processed & Confirmed
        </div>
      )}
    </div>
  );
};
