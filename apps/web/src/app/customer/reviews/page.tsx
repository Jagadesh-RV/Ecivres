"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { CustomerReviewsList, CustomerReviewItem } from "../../../components/customer/CustomerReviewsList";

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/reviews");
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to load customer reviews", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Reviews History</h2>
        <p className="text-xs text-gray-500 mt-1">Review your past ratings and submitted feedback for completed services.</p>
      </div>

      <CustomerReviewsList reviews={reviews} />
    </div>
  );
}
