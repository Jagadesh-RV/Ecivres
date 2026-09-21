import React from 'react';

interface PayoutDashboardWidgetProps {
  availableBalanceUSD: number;
  pendingBalanceUSD: number;
  lastPayoutDate?: string;
}

export const PayoutDashboardWidget: React.FC<PayoutDashboardWidgetProps> = ({
  availableBalanceUSD,
  pendingBalanceUSD,
  lastPayoutDate,
}) => {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Stripe Connect Earnings & Payouts</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 font-medium">Available Payout</p>
          <p className="text-2xl font-bold text-emerald-600">${availableBalanceUSD.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 font-medium">Pending Processing</p>
          <p className="text-2xl font-bold text-slate-700">${pendingBalanceUSD.toFixed(2)}</p>
        </div>
      </div>
      {lastPayoutDate && (
        <p className="text-xs text-slate-400">Last automatic payout completed on {lastPayoutDate}</p>
      )}
    </div>
  );
};
