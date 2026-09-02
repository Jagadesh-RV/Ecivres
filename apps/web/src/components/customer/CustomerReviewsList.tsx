import React from "react";
import { RatingStars } from "../ui/RatingStars";

export interface CustomerReviewItem {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  booking?: {
    service?: {
      name: string;
      provider?: {
        businessName: string;
      };
    };
  };
}

interface CustomerReviewsListProps {
  reviews: CustomerReviewItem[];
}

export const CustomerReviewsList: React.FC<CustomerReviewsListProps> = ({ reviews }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Submitted Ratings & Reviews</h3>
        <span className="text-xs text-gray-500 font-medium">{reviews.length} Reviews Written</span>
      </div>

      {reviews.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          You haven't written any reviews yet. Complete a service booking to leave feedback!
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {reviews.map((item) => (
            <div key={item.id} className="p-5 hover:bg-gray-50/60 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {item.booking?.service?.name || "Service"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Provider: {item.booking?.service?.provider?.businessName || "Service Provider"}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <RatingStars rating={item.rating} />
              </div>

              {item.comment && (
                <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  "{item.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
