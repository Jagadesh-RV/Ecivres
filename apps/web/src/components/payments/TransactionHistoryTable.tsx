"use client";

import React from "react";
import { Badge } from "../ui/badge";

export interface TransactionRecord {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionId?: string;
  createdAt: string;
  booking?: {
    service?: {
      name: string;
      price: number;
      provider?: {
        businessName: string;
      };
    };
    customer?: {
      user?: {
        email: string;
      };
    };
  };
}

interface TransactionHistoryTableProps {
  transactions: TransactionRecord[];
  showProviderName?: boolean;
}

export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions,
  showProviderName = true,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-base font-bold text-gray-900">Payment Audit Ledger</h3>
        <p className="text-xs text-gray-500">History of customer payments, receipts, and platform settlement status.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No payment transactions recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">Transaction ID</th>
                <th className="px-6 py-3 font-semibold">Service</th>
                {showProviderName && <th className="px-6 py-3 font-semibold">Provider / Client</th>}
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">
                    {tx.transactionId || tx.id.substring(0, 12)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {tx.booking?.service?.name || "Service Payment"}
                  </td>
                  {showProviderName && (
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {tx.booking?.service?.provider?.businessName || "Provider"}
                        </p>
                        <p className="text-gray-400">
                          {tx.booking?.customer?.user?.email || "Customer"}
                        </p>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      label={tx.status}
                      variant={
                        tx.status === "SUCCESS"
                          ? "success"
                          : tx.status === "PENDING"
                          ? "warning"
                          : "danger"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
