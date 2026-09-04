"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { Button } from "../ui/button";

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  bookingId: string;
  serviceName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  bookingId,
  serviceName,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await client.post("/reviews", {
        bookingId,
        rating,
        comment,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Rate Service</h3>
            <p className="text-xs text-gray-500">{serviceName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-center py-2">
            <label className="text-xs font-semibold text-gray-700 block">Select Rating</label>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform ${
                    star <= rating ? "scale-110" : "opacity-30 grayscale"
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-600 mt-1">
              {rating === 5
                ? "Excellent (5 Stars)"
                : rating === 4
                ? "Good (4 Stars)"
                : rating === 3
                ? "Average (3 Stars)"
                : rating === 2
                ? "Poor (2 Stars)"
                : "Terrible (1 Star)"}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Written Feedback (Optional)</label>
            <textarea
              rows={3}
              placeholder="Share details of your experience with this service provider..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
