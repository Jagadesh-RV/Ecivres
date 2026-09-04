"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { SystemAuditLogsTable, AuditLogItem } from "../../../components/admin/SystemAuditLogsTable";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await client.get("/admin/audit-logs");
      setLogs(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load audit trail logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Security & Operational Audit Log</h1>
        <p className="text-xs text-gray-500 mt-1">
          Immutable audit trail for compliance, role actions, and verification events.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          Loading audit logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-xs text-gray-500">
          No operational audit logs recorded yet.
        </div>
      ) : (
        <SystemAuditLogsTable logs={logs} />
      )}
    </div>
  );
}
