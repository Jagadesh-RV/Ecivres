"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { useAuthStore } from "../../../stores/auth-store";
import { ReviewsList, ReviewItem } from "../../../components/reviews/ReviewsList";

export default function ProviderReviewsPage() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.providerProfile?.id) {
      client
        .get(`/reviews/provider/${user.providerProfile.id}`)
        .then((res) => setReviews(res.data || []))
        .catch((err) => console.error("Failed to load reviews", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

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
        <h2 className="text-xl font-bold text-gray-900">Client Reviews & Reputation</h2>
        <p className="text-xs text-gray-500 mt-1">Review feedback, rating breakdown, and service performance scores.</p>
      </div>

      <ReviewsList reviews={reviews} />
    </div>
  );
}
