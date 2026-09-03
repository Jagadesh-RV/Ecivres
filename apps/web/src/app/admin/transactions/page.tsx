"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { TransactionHistoryTable, TransactionRecord } from "../../../components/payments/TransactionHistoryTable";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/payments/admin/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to load platform transactions", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Platform Payments Audit & Fee Ledger</h2>
        <p className="text-xs text-gray-500 mt-1">Audit all customer payments, provider payouts, and 10% platform commission fee logs.</p>
      </div>

      <TransactionHistoryTable transactions={transactions} showProviderName={true} />
    </div>
  );
}
