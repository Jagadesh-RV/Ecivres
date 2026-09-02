import React from "react";

export interface CustomerStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  unreadNotifications: number;
  totalSpent: number;
}

interface CustomerStatsGridProps {
  stats: CustomerStats;
}

export const CustomerStatsGrid: React.FC<CustomerStatsGridProps> = ({ stats }) => {
  const cards = [
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      icon: "⏳",
      color: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Pending & Confirmed",
    },
    {
      title: "Completed Services",
      value: stats.completedBookings,
      icon: "✅",
      color: "bg-green-50 text-green-700 border-green-100",
      description: "Successfully fulfilled",
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: "💳",
      color: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Lifetime service payments",
    },
    {
      title: "Unread Messages",
      value: stats.unreadNotifications,
      icon: "🔔",
      color: "bg-purple-50 text-purple-700 border-purple-100",
      description: "Notifications & updates",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`p-5 rounded-xl border bg-white shadow-sm flex flex-col justify-between`}
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
