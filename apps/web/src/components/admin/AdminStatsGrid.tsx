import React from "react";

export interface AdminStats {
  totalUsersCount: number;
  totalCustomersCount: number;
  totalProvidersCount: number;
  verifiedProvidersCount: number;
  pendingProvidersCount: number;
  totalBookingsCount: number;
  platformGrossVolume: number;
}

interface AdminStatsGridProps {
  stats: AdminStats;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total Platform Users",
      value: stats.totalUsersCount,
      icon: "👥",
      color: "bg-blue-50 text-blue-700 border-blue-100",
      description: `${stats.totalCustomersCount} Customers / ${stats.totalProvidersCount} Providers`,
    },
    {
      title: "Gross Platform Volume",
      value: `$${stats.platformGrossVolume.toFixed(2)}`,
      icon: "💵",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Total completed transaction volume",
    },
    {
      title: "Pending Verification",
      value: stats.pendingProvidersCount,
      icon: "⏳",
      color: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Providers awaiting verification approval",
    },
    {
      title: "Total Service Bookings",
      value: stats.totalBookingsCount,
      icon: "📋",
      color: "bg-purple-50 text-purple-700 border-purple-100",
      description: "Platform reservations processed",
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
