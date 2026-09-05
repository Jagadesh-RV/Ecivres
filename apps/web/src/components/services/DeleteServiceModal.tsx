"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";

interface DeleteServiceModalProps {
  serviceId: string;
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  serviceId,
  serviceName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await client.delete(`/services/${serviceId}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold">
            ⚠️
          </div>
          <h3 className="text-base font-bold text-gray-900">Delete Service Offering</h3>
          <p className="text-xs text-gray-500">
            Are you sure you want to permanently remove <span className="font-semibold text-gray-900">"{serviceName}"</span>? This action cannot be undone.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Service"}
          </button>
        </div>
      </div>
    </div>
  );
};
