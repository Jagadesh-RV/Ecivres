"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortingDropdownProps {
  value: string;
  onChange: (sort: string) => void;
}

export function SortingDropdown({ value, onChange }: SortingDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 rounded-md border border-input bg-background text-xs font-semibold"
      >
        <option value="NEWEST">Sort: Newest First</option>
        <option value="PRICE_ASC">Price: Low to High</option>
        <option value="PRICE_DESC">Price: High to Low</option>
        <option value="RATING_DESC">Top Rated</option>
      </select>
    </div>
  );
}
