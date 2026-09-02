"use client";

import React, { useState } from "react";
import { Badge } from "../ui/badge";

export interface AdminUserItem {
  id: string;
  email: string;
  createdAt: string;
  userRoles?: Array<{
    role?: {
      name: string;
    };
  }>;
  customerProfile?: any;
  providerProfile?: any;
}

interface UserManagementTableProps {
  users: AdminUserItem[];
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users }) => {
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const filtered = users.filter((u) => {
    if (roleFilter === "ALL") return true;
    const roles = u.userRoles?.map((r) => r.role?.name) || [];
    return roles.includes(roleFilter);
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Registered Platform Users</h3>
          <p className="text-xs text-gray-500">Overview of all registered accounts, roles, and profiles.</p>
        </div>
        <div className="flex items-center space-x-2">
          {["ALL", "CUSTOMER", "PROVIDER", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === r
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No user accounts found matching this filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">User Email</th>
                <th className="px-6 py-3 font-semibold">Assigned Roles</th>
                <th className="px-6 py-3 font-semibold">Profiles</th>
                <th className="px-6 py-3 font-semibold">Joined Date</th>
                <th className="px-6 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((u) => {
                const roles = u.userRoles?.map((r) => r.role?.name).filter(Boolean) || ["CUSTOMER"];
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {roles.map((role) => (
                          <span
                            key={role}
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              role === "ADMIN"
                                ? "bg-red-100 text-red-700"
                                : role === "PROVIDER"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {u.customerProfile && <span className="mr-2">👤 Customer</span>}
                      {u.providerProfile && <span>🏢 Provider</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge label="ACTIVE" variant="success" size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
