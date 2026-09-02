"use client";

import React from "react";
import { Badge } from "../ui/badge";

export interface PendingProviderItem {
  id: string;
  businessName: string;
  description?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
  user?: {
    email: string;
  };
  createdAt?: string;
}

interface ProviderApplicationsTableProps {
  providers: PendingProviderItem[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ProviderApplicationsTable: React.FC<ProviderApplicationsTableProps> = ({
  providers,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Provider Verification Applications</h3>
          <p className="text-xs text-gray-500">Review business profiles and approve marketplace onboarding.</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
          {providers.length} Pending Review
        </span>
      </div>

      {providers.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No pending provider verification applications at this time.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">Business Name</th>
                <th className="px-6 py-3 font-semibold">Account Email</th>
                <th className="px-6 py-3 font-semibold">Phone / Address</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    <div>
                      <p className="font-bold text-gray-900">{p.businessName}</p>
                      <p className="text-xs text-gray-500 font-normal line-clamp-1">
                        {p.description || "Service provider application"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.user?.email || "Email N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <p className="text-xs">{p.phone || "No phone"}</p>
                    <p className="text-[11px] text-gray-400">{p.address || "No address"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      label={p.isVerified ? "VERIFIED" : "PENDING"}
                      variant={p.isVerified ? "success" : "warning"}
                    />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {!p.isVerified && onApprove && (
                      <button
                        onClick={() => onApprove(p.id)}
                        className="px-3 py-1.2 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {onReject && (
                      <button
                        onClick={() => onReject(p.id)}
                        className="px-3 py-1.2 text-xs font-semibold text-red-600 hover:underline"
                      >
                        Reject
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
