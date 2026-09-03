import React from "react";

export interface EarningsSummary {
  grossRevenue: number;
  platformFeeRate: number;
  totalPlatformFees: number;
  netEarnings: number;
  completedTransactionsCount: number;
}

interface ProviderEarningsGridProps {
  summary: EarningsSummary;
}

export const ProviderEarningsGrid: React.FC<ProviderEarningsGridProps> = ({ summary }) => {
  const cards = [
    {
      title: "Gross Sales Revenue",
      value: `$${summary.grossRevenue.toFixed(2)}`,
      icon: "💵",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Total completed client payments",
    },
    {
      title: "Net Earnings (Payouts)",
      value: `$${summary.netEarnings.toFixed(2)}`,
      icon: "💰",
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Available for instant bank payout",
    },
    {
      title: "Platform Fees (10%)",
      value: `$${summary.totalPlatformFees.toFixed(2)}`,
      icon: "🏛️",
      color: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Marketplace commission fees",
    },
    {
      title: "Paid Orders",
      value: summary.completedTransactionsCount,
      icon: "🧾",
      color: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Successful payment transactions",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">{card.title}</span>
            <span className={`p-2 rounded-lg text-lg ${card.color}`}>{card.icon}</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
