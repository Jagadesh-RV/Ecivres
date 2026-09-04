"use client";

import React from "react";

interface PayoutSummaryCardsProps {
  availableBalance: number;
  pendingAmount: number;
  paidOutAmount: number;
  onRequestPayout: () => void;
}

export const PayoutSummaryCards: React.FC<PayoutSummaryCardsProps> = ({
  availableBalance,
  pendingAmount,
  paidOutAmount,
  onRequestPayout,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Available Balance
          </span>
          <span className="text-xl">💰</span>
        </div>
        <div>
          <p className="text-3xl font-extrabold">${availableBalance.toFixed(2)}</p>
          <p className="text-[11px] text-indigo-200 mt-1">Ready for direct deposit bank payout</p>
        </div>
        <button
          onClick={onRequestPayout}
          disabled={availableBalance < 10}
          className="w-full py-2.5 bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-50"
        >
          Request Withdrawal
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Pending Withdrawals
          </span>
          <span className="text-xl">⏳</span>
        </div>
        <p className="text-2xl font-bold text-amber-600">${pendingAmount.toFixed(2)}</p>
        <p className="text-xs text-gray-400">Currently processing with banking network</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Lifetime Paid Out
          </span>
          <span className="text-xl">🏦</span>
        </div>
        <p className="text-2xl font-bold text-emerald-600">${paidOutAmount.toFixed(2)}</p>
        <p className="text-xs text-gray-400">Total funds successfully transferred</p>
      </div>
    </div>
  );
};
