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
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  unreadCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) => {
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
    { label: "Saved Addresses", href: "/customer/addresses", icon: "📍" },
    { label: "Payment Methods", href: "/customer/payment-methods", icon: "💳" },
    { label: "My Reviews", href: "/customer/reviews", icon: "⭐" },
    { label: "Help & Support", href: "/customer/support", icon: "🛟" },
    { label: "Account Settings", href: "/customer/settings", icon: "⚙️" },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Customer Portal
          </h2>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-gray-400 hover:text-gray-600 p-1"
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
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
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

      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 mt-6">
        <p className="text-xs text-gray-500 font-semibold">Need Assistance?</p>
        <p className="text-xs text-gray-400 mt-0.5">Contact 24/7 Platform Support</p>
        <a
          href="mailto:support@ecivres.local"
          className="mt-2 inline-block text-xs font-bold text-indigo-600 hover:underline"
        >
          support@ecivres.local
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0 min-h-[calc(100vh-65px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
