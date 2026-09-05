"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../../stores/auth-store";
import { NotificationBellDropdown } from "../notifications/NotificationBellDropdown";

interface CustomerHeaderProps {
  title?: string;
  onToggleMobileMenu?: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  title = "Dashboard",
  onToggleMobileMenu,
}) => {
  const { user, logout } = useAuthStore();

  const fullName = user?.customerProfile
    ? `${user.customerProfile.firstName} ${user.customerProfile.lastName}`
    : user?.email || "Customer";

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
        )}
        <div>
          <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate max-w-[180px] sm:max-w-none">
            {title}
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 hidden sm:block">
            Welcome back, {fullName}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <NotificationBellDropdown />

        <Link
          href="/customer/services"
          className="inline-flex items-center px-2.5 sm:px-3.5 py-1.5 border border-transparent text-[11px] sm:text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs whitespace-nowrap"
        >
          Book Service
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-4 border-gray-200">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {fullName.substring(0, 2)}
          </div>
          <button
            onClick={() => logout()}
            className="text-[11px] sm:text-xs font-medium text-gray-500 hover:text-red-600 transition-colors hidden sm:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
