"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface ProviderNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface ProviderSidebarProps {
  pendingBookingsCount?: number;
}

export const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ pendingBookingsCount = 0 }) => {
  const pathname = usePathname();

  const navItems: ProviderNavItem[] = [
    { label: "Dashboard", href: "/provider", icon: "📈" },
    {
      label: "Client Bookings",
      href: "/provider/bookings",
      icon: "📋",
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
    },
    { label: "My Services", href: "/provider/services", icon: "🛠️" },
    { label: "Revenue & Payouts", href: "/provider/earnings", icon: "💵" },
    { label: "Add New Service", href: "/provider/services/create", icon: "➕" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 py-2 border-b border-slate-800">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Provider Business Portal
          </h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
        <p className="text-xs text-slate-300 font-semibold">Verified Partner</p>
        <p className="text-xs text-slate-400 mt-0.5">Instant Payouts & Stripe Connected</p>
      </div>
    </aside>
  );
};
