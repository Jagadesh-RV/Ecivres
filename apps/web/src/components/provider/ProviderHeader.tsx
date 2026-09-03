"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../../stores/auth-store";
import { NotificationBellDropdown } from "../notifications/NotificationBellDropdown";

interface ProviderHeaderProps {
  businessName?: string;
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ businessName }) => {
  const { user, logout } = useAuthStore();

  const title = businessName || user?.providerProfile?.businessName || "Provider Workspace";

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <p className="text-xs text-slate-400">Manage client requests, active services & revenue</p>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationBellDropdown />

        <Link
          href="/provider/services/create"
          className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Add New Service
        </Link>

        <div className="flex items-center space-x-3 border-l pl-4 border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase">
            {title.substring(0, 2)}
          </div>
          <button
            onClick={() => logout()}
            className="text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
