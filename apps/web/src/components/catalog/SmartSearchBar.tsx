'use client';

import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Calendar, Clock, Tag } from 'lucide-react';

export interface ParsedQueryBadge {
  intent?: string;
  categoryKeyword?: string;
  bookingDate?: string;
  timeSlot?: string;
  nearMe?: boolean;
}

interface SmartSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  parsedQuery?: ParsedQueryBadge;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  onSearch,
  isLoading = false,
  parsedQuery,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-indigo-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "AC repair near me tomorrow morning" or "Plumber under $100"'
          className="w-full pl-12 pr-32 py-4 bg-slate-900/90 border border-indigo-500/30 focus:border-indigo-500 rounded-2xl text-white placeholder-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? 'Parsing AI...' : 'Smart Search'}</span>
        </button>
      </form>

      {/* Extracted AI Tags Bar */}
      {parsedQuery && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1">AI Extracted Filters:</span>
          {parsedQuery.categoryKeyword && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">
              <Tag className="w-3 h-3" />
              {parsedQuery.categoryKeyword}
            </span>
          )}
          {parsedQuery.timeSlot && parsedQuery.timeSlot !== 'ANYTIME' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium">
              <Clock className="w-3 h-3" />
              {parsedQuery.timeSlot}
            </span>
          )}
          {parsedQuery.nearMe && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
              <MapPin className="w-3 h-3" />
              Near Me (15km radius)
            </span>
          )}
          {parsedQuery.intent && (
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
              Intent: {parsedQuery.intent}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
