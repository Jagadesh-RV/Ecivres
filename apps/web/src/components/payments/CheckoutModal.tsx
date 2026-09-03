"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  amount: number;
  bookingId: string;
  onPaymentSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  serviceName,
  amount,
  bookingId,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc) {
      setError("Please complete all payment card fields.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Simulate payment processing latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(`Payment of $${amount.toFixed(2)} confirmed for ${serviceName}!`);
      if (onPaymentSuccess) onPaymentSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Secure Payment Checkout</h3>
            <p className="text-xs text-gray-500">Powered by Stripe Encrypted Gateway</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-600">
            <span>Service:</span>
            <span className="text-gray-900 font-bold">{serviceName}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total Payable:</span>
            <span className="text-indigo-600 font-extrabold text-lg">${amount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Card Number</label>
            <input
              type="text"
              placeholder="4242 •••• •••• 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Expiry (MM/YY)</label>
              <input
                type="text"
                placeholder="12/28"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">CVC</label>
              <input
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700">
              {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
