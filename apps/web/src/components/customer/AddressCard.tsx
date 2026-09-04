"use client";

import React from "react";

export interface AddressItem {
  id: string;
  label: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

interface AddressCardProps {
  address: AddressItem;
  onDelete?: (id: string) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {address.label}
        </span>
        {address.isDefault && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Default Location
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-bold text-gray-900">{address.streetAddress}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {address.city}, {address.state} {address.postalCode}
        </p>
      </div>

      {onDelete && !address.isDefault && (
        <div className="pt-2 border-t border-gray-100 text-right">
          <button
            onClick={() => onDelete(address.id)}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Remove Address
          </button>
        </div>
      )}
    </div>
  );
};
