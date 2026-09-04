"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ProviderEarningsGrid, EarningsSummary } from "../../../components/payments/ProviderEarningsGrid";
import { TransactionHistoryTable, TransactionRecord } from "../../../components/payments/TransactionHistoryTable";
import { PayoutSummaryCards } from "../../../components/provider/PayoutSummaryCards";
import { PayoutRequestModal } from "../../../components/provider/PayoutRequestModal";

export default function ProviderEarningsPage() {
  const [summary, setSummary] = useState<EarningsSummary>({
    grossRevenue: 0,
    platformFeeRate: 0.1,
    totalPlatformFees: 0,
    netEarnings: 0,
    completedTransactionsCount: 0,
  });
  const [payoutSummary, setPayoutSummary] = useState<{
    availableBalance: number;
    pendingAmount: number;
    paidOutAmount: number;
  }>({
    availableBalance: 0,
    pendingAmount: 0,
    paidOutAmount: 0,
  });
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEarningsAndPayouts = async () => {
    try {
      setIsLoading(true);
      const [earningsRes, payoutsRes] = await Promise.all([
        client.get("/payments/provider/earnings"),
        client.get("/payouts/summary"),
      ]);
      setSummary(earningsRes.data);
      setTransactions(earningsRes.data.recentPayments || []);
      setPayoutSummary(payoutsRes.data);
    } catch (err) {
      console.error("Failed to load provider earnings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsAndPayouts();
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
      </div>

      <PayoutSummaryCards
        availableBalance={payoutSummary.availableBalance}
        pendingAmount={payoutSummary.pendingAmount}
        paidOutAmount={payoutSummary.paidOutAmount}
        onRequestPayout={() => setIsModalOpen(true)}
      />

      <ProviderEarningsGrid summary={summary} />

      <TransactionHistoryTable transactions={transactions} showProviderName={false} />

      <PayoutRequestModal
        isOpen={isModalOpen}
        maxAmount={payoutSummary.availableBalance}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEarningsAndPayouts}
      />
    </div>
  );
}
