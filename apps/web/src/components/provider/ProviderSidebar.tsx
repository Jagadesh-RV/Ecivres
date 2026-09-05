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
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const ProviderSidebar: React.FC<ProviderSidebarProps> = ({
  pendingBookingsCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) => {
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
    { label: "Operating Hours", href: "/provider/availability", icon: "🕒" },
    { label: "Revenue & Payouts", href: "/provider/earnings", icon: "💵" },
    { label: "Client Reviews", href: "/provider/reviews", icon: "⭐" },
    { label: "Partner Support", href: "/provider/support", icon: "🛟" },
    { label: "Add New Service", href: "/provider/services/create", icon: "➕" },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Provider Business Portal
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

      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 mt-6">
        <p className="text-xs text-slate-300 font-semibold">Verified Partner</p>
        <p className="text-xs text-slate-400 mt-0.5">Instant Payouts & Stripe Connected</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 min-h-[calc(100vh-65px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-72 max-w-[80vw] bg-slate-900 text-white h-full shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
