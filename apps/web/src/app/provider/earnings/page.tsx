"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ProviderEarningsGrid, EarningsSummary } from "../../../components/payments/ProviderEarningsGrid";
import { TransactionHistoryTable, TransactionRecord } from "../../../components/payments/TransactionHistoryTable";

export default function ProviderEarningsPage() {
  const [summary, setSummary] = useState<EarningsSummary>({
    grossRevenue: 0,
    platformFeeRate: 0.1,
    totalPlatformFees: 0,
    netEarnings: 0,
    completedTransactionsCount: 0,
  });
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/payments/provider/earnings");
      setSummary(res.data);
      setTransactions(res.data.recentPayments || []);
    } catch (err) {
      console.error("Failed to load provider earnings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Revenue & Instant Payouts</h2>
          <p className="text-xs text-gray-500 mt-1">Track net earnings, commission fees, and payout statements.</p>
        </div>
        <button
          onClick={() => alert("Payout request initiated! Funds transferred via Stripe Connected Account.")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
        >
          💳 Request Instant Payout
        </button>
      </div>

      <ProviderEarningsGrid summary={summary} />

      <TransactionHistoryTable transactions={transactions} showProviderName={false} />
    </div>
  );
}
