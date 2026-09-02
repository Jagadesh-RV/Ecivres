"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface CustomerSidebarProps {
  unreadCount?: number;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ unreadCount = 0 }) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Overview", href: "/customer", icon: "📊" },
    { label: "My Bookings", href: "/customer/bookings", icon: "📅" },
    {
      label: "Notifications",
      href: "/customer/notifications",
      icon: "🔔",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: "Saved Favorites", href: "/customer/favorites", icon: "❤️" },
    { label: "My Reviews", href: "/customer/reviews", icon: "⭐" },
    { label: "Account Settings", href: "/customer/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Customer Portal
          </h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs text-gray-500 font-medium">Need Assistance?</p>
        <p className="text-xs text-gray-400 mt-0.5">Contact 24/7 Support Support</p>
        <a
          href="mailto:support@ecivres.local"
          className="mt-2 inline-block text-xs font-bold text-indigo-600 hover:underline"
        >
          support@ecivres.local
        </a>
      </div>
    </aside>
  );
};
