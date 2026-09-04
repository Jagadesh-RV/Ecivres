"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { Button } from "../ui/button";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("12");
  const [expYear, setExpYear] = useState("2026");
  const [brand, setBrand] = useState("Visa");
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const last4 = cardNumber.slice(-4) || "4242";

    try {
      await client.post("/payments/methods", {
        cardholderName,
        brand,
        last4,
        expMonth: parseInt(expMonth, 10),
        expYear: parseInt(expYear, 10),
        isDefault,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add payment method");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900">Add Saved Card</h3>
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
            <label className="text-xs font-semibold text-gray-700">Cardholder Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-700">Card Number</label>
              <input
                type="text"
                maxLength={16}
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">Amex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Exp Month</label>
              <input
                type="number"
                min="1"
                max="12"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Exp Year</label>
              <input
                type="number"
                min="2024"
                max="2035"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <label className="flex items-center space-x-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-gray-700">Set as default payment method</span>
          </label>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? "Saving..." : "Save Card"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
