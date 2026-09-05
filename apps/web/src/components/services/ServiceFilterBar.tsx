"use client";

import React from "react";

interface ServiceFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  minPrice: string;
  onMinPriceChange: (val: string) => void;
  maxPrice: string;
  onMaxPriceChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onResetFilters: () => void;
}

export const ServiceFilterBar: React.FC<ServiceFilterBarProps> = ({
  search,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3.5 sm:p-4 shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <span className="absolute left-3.5 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search services by keyword or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Price Range & Sort Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 sm:flex-initial">
            <span className="text-xs font-semibold text-gray-600 shrink-0">Price ($):</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-16 sm:w-20 px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
            />
            <span className="text-xs text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-16 sm:w-20 px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-semibold text-gray-600 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
            </select>
          </div>

          <button
            onClick={onResetFilters}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shrink-0"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
