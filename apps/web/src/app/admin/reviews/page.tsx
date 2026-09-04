"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ReviewModerationTable } from "../../../components/admin/ReviewModerationTable";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFlaggedReviews = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await client.get("/reviews/moderation/pending");
      setReviews(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load flagged reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedReviews();
  }, []);

  const handleModerate = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      await client.patch(`/reviews/${id}/moderate`, { action });
      fetchFlaggedReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to process moderation action");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Moderation Queue</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review and audit user feedback flagged for policy violations or inappropriate content.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          Loading flagged reviews queue...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-2">
          <p className="text-sm font-bold text-gray-800">Queue is Clear! 🎉</p>
          <p className="text-xs text-gray-500">No pending flagged reviews require moderation.</p>
        </div>
      ) : (
        <ReviewModerationTable reviews={reviews} onModerate={handleModerate} />
      )}
    </div>
  );
}
