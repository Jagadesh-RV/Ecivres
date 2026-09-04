"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface AdminSidebarProps {
  pendingApplicationsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ pendingApplicationsCount = 0 }) => {
  const pathname = usePathname();

  const navItems: AdminNavItem[] = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "User Accounts", href: "/admin/users", icon: "👥" },
    {
      label: "Provider Verification",
      href: "/admin/providers",
      icon: "🏢",
      badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined,
    },
    { label: "Category Management", href: "/admin/categories", icon: "🏷️" },
    { label: "Promotions & Coupons", href: "/admin/coupons", icon: "🎟️" },
    { label: "Review Moderation", href: "/admin/reviews", icon: "🛡️" },
    { label: "Revenue & Analytics", href: "/admin/analytics", icon: "💵" },
    { label: "Transaction Ledger", href: "/admin/transactions", icon: "🧾" },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 py-2 border-b border-slate-800">
          <h2 className="text-xs font-bold text-red-500 uppercase tracking-wider">
            System Control Panel
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
                    ? "bg-red-600 text-white font-semibold shadow-sm"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
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

      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
        <p className="text-xs text-slate-300 font-semibold">Super Admin Mode</p>
        <p className="text-xs text-slate-500 mt-0.5">Platform Governance & Audit Active</p>
      </div>
    </aside>
  );
};
