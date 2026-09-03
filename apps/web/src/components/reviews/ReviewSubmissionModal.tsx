"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { Button } from "../ui/button";

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceName: string;
  onReviewSubmitted?: () => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  serviceName,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await client.post("/reviews", {
        bookingId,
        rating,
        comment,
      });
      alert("Thank you! Your feedback has been submitted.");
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Rate & Review Service</h3>
            <p className="text-xs text-gray-500">{serviceName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="text-center py-2 space-y-2">
            <span className="text-xs font-semibold text-gray-600">Your Rating</span>
            <div className="flex justify-center space-x-2 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-transform hover:scale-110 ${
                    star <= rating ? "text-amber-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-600">
              {rating === 5 ? "⭐⭐⭐⭐⭐ Excellent" : `${rating} / 5 Stars`}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Write Your Feedback</label>
            <textarea
              placeholder="Share details about your experience with this service provider..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
              {submitting ? "Submitting..." : "Publish Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
