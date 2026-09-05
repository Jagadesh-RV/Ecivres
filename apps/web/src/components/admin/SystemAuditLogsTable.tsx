"use client";

import React from "react";

export interface AuditLogItem {
  id: string;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

interface SystemAuditLogsTableProps {
  logs: AuditLogItem[];
}

export const SystemAuditLogsTable: React.FC<SystemAuditLogsTableProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600 min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-wider text-[11px] font-bold text-gray-500">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Action Event</th>
              <th className="px-4 py-3">Actor / User</th>
              <th className="px-4 py-3">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 text-gray-500 font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-medium text-gray-900">{log.actor}</td>
                <td className="px-4 py-3.5 text-gray-700">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
