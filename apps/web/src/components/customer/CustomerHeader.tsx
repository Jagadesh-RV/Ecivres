"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "../../stores/auth-store";

interface CustomerHeaderProps {
  title?: string;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ title = "Dashboard" }) => {
  const { user, logout } = useAuthStore();

  const fullName = user?.customerProfile
    ? `${user.customerProfile.firstName} ${user.customerProfile.lastName}`
    : user?.email || "Customer";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-500">Welcome back, {fullName}</p>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/services"
          className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Book New Service
        </Link>

        <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
            {fullName.substring(0, 2)}
          </div>
          <button
            onClick={() => logout()}
            className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
