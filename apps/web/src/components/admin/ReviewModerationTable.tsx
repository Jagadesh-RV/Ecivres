"use client";

import React from "react";

export interface FlaggedReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: { email: string };
  booking?: { service?: { name: string } };
  flagInfo?: { reason: string; status: string };
}

interface ReviewModerationTableProps {
  reviews: FlaggedReviewData[];
  onModerate: (id: string, action: "APPROVE" | "REJECT") => void;
}

export const ReviewModerationTable: React.FC<ReviewModerationTableProps> = ({
  reviews,
  onModerate,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-wider text-[11px] font-bold text-gray-500">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Flag Reason</th>
              <th className="px-4 py-3 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 font-bold text-gray-900">
                  {rev.booking?.service?.name || "Service"}
                </td>
                <td className="px-4 py-3.5 text-gray-600">{rev.author?.email || "Customer"}</td>
                <td className="px-4 py-3.5 font-semibold text-amber-600">
                  {"⭐".repeat(rev.rating)} ({rev.rating})
                </td>
                <td className="px-4 py-3.5 text-gray-700 max-w-xs truncate">
                  {rev.comment || "No written comment"}
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold text-[11px]">
                    {rev.flagInfo?.reason || "Flagged"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right space-x-2">
                  <button
                    onClick={() => onModerate(rev.id, "APPROVE")}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onModerate(rev.id, "REJECT")}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[11px]"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
