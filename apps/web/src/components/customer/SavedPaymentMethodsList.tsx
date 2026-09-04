"use client";

import React from "react";

export interface PaymentMethodItem {
  id: string;
  cardholderName: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface SavedPaymentMethodsListProps {
  methods: PaymentMethodItem[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SavedPaymentMethodsList: React.FC<SavedPaymentMethodsListProps> = ({
  methods,
  onSetDefault,
  onDelete,
}) => {
  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳 Visa";
      case "mastercard":
        return "💳 Mastercard";
      case "amex":
        return "💳 Amex";
      default:
        return "💳 Card";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {methods.map((pm) => (
        <div
          key={pm.id}
          className={`bg-white rounded-xl border p-5 shadow-sm space-y-3 transition-all ${
            pm.isDefault ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
              {getBrandIcon(pm.brand)}
            </span>
            {pm.isDefault ? (
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Default Source
              </span>
            ) : (
              <button
                onClick={() => onSetDefault(pm.id)}
                className="text-xs font-semibold text-gray-500 hover:text-indigo-600 underline"
              >
                Set as Default
              </button>
            )}
          </div>

          <div>
            <p className="text-base font-mono font-bold text-gray-900 tracking-wider">
              •••• •••• •••• {pm.last4}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
              <span>{pm.cardholderName}</span>
              <span>
                Exp {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => onDelete(pm.id)}
              className="text-xs font-semibold text-red-600 hover:text-red-800"
            >
              Remove Card
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
