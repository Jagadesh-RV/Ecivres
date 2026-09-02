"use client";

import React from "react";
import { useAuthStore } from "../../stores/auth-store";

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-xl">🛡️</span>
        <div>
          <h1 className="text-lg font-bold text-white">EcivreS Governance Console</h1>
          <p className="text-xs text-slate-400">System Monitoring & Verification Portal</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ● All Systems Operational
        </span>

        <div className="flex items-center space-x-3 border-l pl-4 border-slate-800">
          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            {user?.email || "Admin User"}
          </span>
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
