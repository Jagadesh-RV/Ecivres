"use client";

import React from "react";

interface ProviderEarningsLedgerCardProps {
  grossRevenue: number;
  platformFees: number;
  netEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  onRequestPayout?: () => void;
}

export const ProviderEarningsLedgerCard: React.FC<ProviderEarningsLedgerCardProps> = ({
  grossRevenue,
  platformFees,
  netEarnings,
  availableBalance,
  pendingBalance,
  onRequestPayout,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Earnings & Financial Ledger</h3>
          <p className="text-xs text-gray-500">Real-time marketplace revenue and balance tracking</p>
        </div>
        {onRequestPayout && (
          <button
            onClick={onRequestPayout}
            disabled={availableBalance <= 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Request Payout (${availableBalance.toFixed(2)})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 block">Available Balance</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
            ${availableBalance.toFixed(2)}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            Ready for instant payout
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-amber-700 block">Pending Escrow Balance</span>
          <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
            ${pendingBalance.toFixed(2)}
          </span>
          <span className="text-[10px] text-amber-700 mt-1 block">
            Releases upon service completion
          </span>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-indigo-700 block">Lifetime Net Earnings</span>
          <span className="text-2xl font-extrabold text-indigo-900 mt-1 block">
            ${netEarnings.toFixed(2)}
          </span>
          <span className="text-[10px] text-indigo-700 mt-1 block">After 10% commission</span>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-gray-500 block">Gross Sales Volume</span>
          <span className="text-2xl font-extrabold text-gray-900 mt-1 block">
            ${grossRevenue.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-500 mt-1 block">
            Fees: -${platformFees.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
