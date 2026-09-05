"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";

interface ReviewCompletionModalProps {
  isOpen: boolean;
  bookingId: string;
  serviceName?: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const ReviewCompletionModal: React.FC<ReviewCompletionModalProps> = ({
  isOpen,
  bookingId,
  serviceName,
  onClose,
  onSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/reviews", {
        bookingId,
        rating,
        comment,
      });
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">How was your service?</h3>
            <p className="text-xs text-gray-500">{serviceName || `Booking ID: ${bookingId}`}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 rounded-lg hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-xs font-semibold text-gray-500 mb-2">Tap to Rate</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating ?? rating);
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="text-3xl transition-transform hover:scale-125 focus:outline-hidden"
                  >
                    <span className={active ? "text-amber-400" : "text-gray-200"}>★</span>
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-amber-700 mt-1">
              {rating === 5 ? "Excellent (5/5)" : rating === 4 ? "Very Good (4/5)" : rating === 3 ? "Average (3/5)" : rating === 2 ? "Below Average (2/5)" : "Poor (1/5)"}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Review / Feedback
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details of your experience to help future customers..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
