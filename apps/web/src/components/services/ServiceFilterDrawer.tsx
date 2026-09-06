"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, X, RotateCcw } from "lucide-react";

interface ServiceFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  minPrice: string;
  onMinPriceChange: (val: string) => void;
  maxPrice: string;
  onMaxPriceChange: (val: string) => void;
  minRating: string;
  onMinRatingChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onReset: () => void;
}

export function ServiceFilterDrawer({
  isOpen,
  onClose,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  onReset,
}: ServiceFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Filter & Sort Catalog</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-bold">Price Range ($)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="drawerMin" className="text-xs text-muted-foreground">Minimum</Label>
                <Input
                  id="drawerMin"
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="drawerMax" className="text-xs text-muted-foreground">Maximum</Label>
                <Input
                  id="drawerMax"
                  type="number"
                  placeholder="500"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-sm font-bold">Minimum Rating</Label>
            <select
              value={minRating}
              onChange={(e) => onMinRatingChange(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Any Rating</option>
              <option value="4">4.0+ Stars ⭐⭐⭐⭐</option>
              <option value="4.5">4.5+ Stars ⭐⭐⭐⭐⭐</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-sm font-bold">Sort Order</Label>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="newest">Newest Additions</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated Providers</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t mt-6">
          <Button variant="outline" onClick={onReset} className="flex-1 gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button onClick={onClose} className="flex-1">Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}
