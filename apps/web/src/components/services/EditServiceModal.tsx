"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { Button } from "../ui/button";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId?: string;
}

interface EditServiceModalProps {
  service: ServiceData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description || "");
  const [price, setPrice] = useState(service.price.toString());
  const [duration, setDuration] = useState(service.duration.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await client.patch(`/services/${service.id}`, {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration, 10),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update service details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900">Edit Service Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Service Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Duration (Mins)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
