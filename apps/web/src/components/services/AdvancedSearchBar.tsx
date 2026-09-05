"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface AdvancedSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearchSubmit?: () => void;
  placeholder?: string;
}

export function AdvancedSearchBar({ value, onChange, onSearchSubmit, placeholder = "Search services by name, category, or provider..." }: AdvancedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className={`relative flex items-center bg-white rounded-xl border transition-all ${isFocused ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-gray-300"}`}>
        <Search className="h-4 w-4 text-gray-400 ml-3.5 shrink-0" />
        <input
          type="text"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-2.5 pr-10 py-2.5 text-sm bg-transparent border-none focus:outline-none text-gray-900"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
