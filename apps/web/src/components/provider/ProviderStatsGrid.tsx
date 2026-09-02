import React from "react";

export interface ProviderStats {
  activeServicesCount: number;
  totalBookingsCount: number;
  pendingBookingsCount: number;
  totalEarnings: number;
}

interface ProviderStatsGridProps {
  stats: ProviderStats;
}

export const ProviderStatsGrid: React.FC<ProviderStatsGridProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: "💵",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Completed booking payments",
    },
    {
      title: "Pending Requests",
      value: stats.pendingBookingsCount,
      icon: "🛎️",
      color: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Awaiting confirmation",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookingsCount,
      icon: "📊",
      color: "bg-blue-50 text-blue-700 border-blue-100",
      description: "All client requests",
    },
    {
      title: "Active Listings",
      value: stats.activeServicesCount,
      icon: "⚙️",
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
      description: "Published marketplace services",
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
