import React from "react";

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: {
    email: string;
  };
  booking?: {
    service?: {
      name: string;
    };
  };
}

interface ReviewsListProps {
  reviews: ReviewItem[];
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
        No customer reviews written yet.
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Overall Client Rating
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">{averageRating}</span>
            <div className="text-amber-400 text-xl">
              {"★".repeat(Math.round(Number(averageRating)))}
              <span className="text-gray-300">
                {"★".repeat(5 - Math.round(Number(averageRating)))}
              </span>
            </div>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
          {reviews.length} Total Reviews
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {rev.author?.email || "Verified Customer"}
                </p>
                {rev.booking?.service?.name && (
                  <p className="text-xs text-gray-400">Service: {rev.booking.service.name}</p>
                )}
              </div>
              <div className="flex items-center space-x-1 text-amber-400 text-sm font-bold">
                <span>{"★".repeat(rev.rating)}</span>
                <span className="text-xs text-gray-400 font-semibold ml-1">({rev.rating}/5)</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
              "{rev.comment}"
            </p>

            <span className="text-[10px] text-gray-400 block text-right">
              {new Date(rev.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
