"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "../../../lib/axios";

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  _count?: {
    services: number;
  };
}

export default function CustomerCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .get("/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Failed to load categories", err))
      .finally(() => setIsLoading(false));
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
        <h2 className="text-xl font-bold text-gray-900">Browse Service Categories</h2>
        <p className="text-xs text-gray-500 mt-1">Explore verified professional service categories tailored to your needs.</p>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
          No categories available at the moment. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4 font-bold">
                  🏷️
                </div>
                <h3 className="text-base font-bold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {cat.description || "Top rated professional services available in this category."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">
                  {cat._count?.services || 0} Services Listed
                </span>
                <Link
                  href={`/customer/services?categoryId=${cat.id}`}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Explore Services →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
