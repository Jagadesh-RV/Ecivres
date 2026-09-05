"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../../stores/auth-store";
import { NotificationBellDropdown } from "../notifications/NotificationBellDropdown";

interface ProviderHeaderProps {
  businessName?: string;
  onToggleMobileMenu?: () => void;
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({
  businessName,
  onToggleMobileMenu,
}) => {
  const { user, logout } = useAuthStore();

  const title = businessName || user?.providerProfile?.businessName || "Provider Workspace";

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
        )}
        <div>
          <h1 className="text-base sm:text-xl font-bold text-white truncate max-w-[180px] sm:max-w-none">
            {title}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
            Manage client requests, active services & revenue
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <NotificationBellDropdown />

        <Link
          href="/provider/services/create"
          className="inline-flex items-center px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs whitespace-nowrap"
        >
          + Add Service
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-4 border-slate-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {title.substring(0, 2)}
          </div>
          <button
            onClick={() => logout()}
            className="text-[11px] sm:text-xs font-medium text-slate-400 hover:text-red-400 transition-colors hidden sm:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
