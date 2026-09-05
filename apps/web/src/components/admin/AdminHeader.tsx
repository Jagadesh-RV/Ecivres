"use client";

import React from "react";
import { useAuthStore } from "../../stores/auth-store";

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
            aria-label="Toggle Governance Menu"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
        )}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-xl">🛡️</span>
          <div>
            <h1 className="text-sm sm:text-lg font-bold text-white truncate max-w-[180px] sm:max-w-none">
              Governance Console
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
              System Monitoring & Verification Portal
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
          ● <span className="hidden sm:inline ml-1">All Systems Operational</span>
        </span>

        <div className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-4 border-slate-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            AD
          </div>
          <span className="text-xs text-slate-300 font-medium hidden lg:inline">
            {user?.email || "Admin User"}
          </span>
          <button
            onClick={() => logout()}
            className="text-[11px] sm:text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
