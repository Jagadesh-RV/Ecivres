"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  _count?: {
    services: number;
  };
}

interface CategoryManagementGridProps {
  categories: CategoryItem[];
  onCreateCategory?: (name: string, description: string) => Promise<void>;
  onDeleteCategory?: (id: string) => Promise<void>;
}

export const CategoryManagementGrid: React.FC<CategoryManagementGridProps> = ({
  categories,
  onCreateCategory,
  onDeleteCategory,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !onCreateCategory) return;
    setSubmitting(true);
    try {
      await onCreateCategory(name, description);
      setName("");
      setDescription("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create category", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Platform Category Catalog</h3>
          <p className="text-xs text-gray-500">Manage categories available for service providers.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
        >
          {isCreating ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-gray-900">Create New Category</h4>
          <div className="space-y-3 max-w-md">
            <div>
              <label className="text-xs font-semibold text-gray-700">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Appliance Repair"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Description</label>
              <textarea
                placeholder="Category summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mt-1"
              />
            </div>
            <Button type="submit" disabled={submitting} size="sm">
              {submitting ? "Publishing..." : "Publish Category"}
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl">🏷️</span>
                <span className="text-xs font-semibold text-gray-400">
                  {cat._count?.services || 0} Listed Services
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mt-3">{cat.name}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {cat.description || "Active platform category."}
              </p>
            </div>

            {onDeleteCategory && (
              <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Delete Category
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
