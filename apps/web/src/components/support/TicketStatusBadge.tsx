import React from "react";

export function TicketStatusBadge({ status }: { status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" }) {
  const badgeMap = {
    OPEN: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CLOSED: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeMap[status] || badgeMap.OPEN}`}>
      {status.replace("_", " ")}
    </span>
  );
}
