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
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  pendingApplicationsCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) => {
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
    { label: "Disputes & Support", href: "/admin/disputes", icon: "⚖️" },
    { label: "Revenue & Analytics", href: "/admin/analytics", icon: "💵" },
    { label: "Transaction Ledger", href: "/admin/transactions", icon: "🧾" },
    { label: "Security Audit Logs", href: "/admin/audit", icon: "📜" },
    { label: "Platform Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800">
          <h2 className="text-xs font-bold text-red-500 uppercase tracking-wider">
            System Control Panel
          </h2>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          )}
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-600 text-white font-semibold shadow-xs"
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

      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 mt-6">
        <p className="text-xs text-slate-300 font-semibold">Super Admin Mode</p>
        <p className="text-xs text-slate-500 mt-0.5">Platform Governance & Audit Active</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-white shrink-0 min-h-[calc(100vh-65px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-72 max-w-[80vw] bg-slate-950 text-white h-full shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
