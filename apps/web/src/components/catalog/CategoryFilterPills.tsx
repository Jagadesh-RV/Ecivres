"use client";

import React from "react";

export interface CategoryOption {
  id: string;
  name: string;
}

interface CategoryFilterPillsProps {
  categories: CategoryOption[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryFilterPills: React.FC<CategoryFilterPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory("all")}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
          selectedCategoryId === "all"
            ? "bg-indigo-600 text-white shadow-sm"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All Categories
      </button>
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              isSelected
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
