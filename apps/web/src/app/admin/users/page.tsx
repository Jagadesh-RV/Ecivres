"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { UserManagementTable, AdminUserItem } from "../../../components/admin/UserManagementTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">User Accounts & Roles Governance</h2>
        <p className="text-xs text-gray-500 mt-1">Audit customer and provider accounts registered across the platform.</p>
      </div>

      <UserManagementTable users={users} />
    </div>
  );
}
