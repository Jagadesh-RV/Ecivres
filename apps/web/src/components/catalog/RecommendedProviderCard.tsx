'use client';

import React from 'react';
import { Star, ShieldCheck, MapPin, Award, CheckCircle, Zap } from 'lucide-react';

export interface RecommendedProviderProps {
  providerId: string;
  businessName: string;
  isVerified: boolean;
  score: number;
  breakdown: {
    ratingScore: number;
    completionScore: number;
    responseTimeScore: number;
    distanceScore: number;
    repeatCustomerScore: number;
  };
  distanceKm?: number;
  averageRating: number;
  completedBookingsCount: number;
  onSelect?: (providerId: string) => void;
}

export const RecommendedProviderCard: React.FC<RecommendedProviderProps> = ({
  providerId,
  businessName,
  isVerified,
  score,
  breakdown,
  distanceKm,
  averageRating,
  completedBookingsCount,
  onSelect,
}) => {
  const matchPercentage = Math.round(score * 100);

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* AI Match Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
        <Zap className="w-3.5 h-3.5 fill-indigo-400" />
        <span>{matchPercentage}% AI Match</span>
      </div>

      <div className="flex items-start gap-4">
        {/* Avatar Placeholder */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          {businessName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white truncate">{businessName}</h3>
            {isVerified && (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              {averageRating}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {completedBookingsCount} jobs completed
            </span>
            {distanceKm !== undefined && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-indigo-300">
                  <MapPin className="w-4 h-4" />
                  {distanceKm} km away
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendation Score Breakdown */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-5 gap-2 text-center text-xs">
        <div className="bg-slate-800/40 rounded-lg p-2">
          <div className="text-slate-400 mb-0.5">Rating</div>
          <div className="font-semibold text-slate-200">{Math.round(breakdown.ratingScore * 100)}%</div>
        </div>
        <div className="bg-slate-800/40 rounded-lg p-2">
          <div className="text-slate-400 mb-0.5">Completion</div>
          <div className="font-semibold text-slate-200">{Math.round(breakdown.completionScore * 100)}%</div>
        </div>
        <div className="bg-slate-800/40 rounded-lg p-2">
          <div className="text-slate-400 mb-0.5">Speed</div>
          <div className="font-semibold text-slate-200">{Math.round(breakdown.responseTimeScore * 100)}%</div>
        </div>
        <div className="bg-slate-800/40 rounded-lg p-2">
          <div className="text-slate-400 mb-0.5">Distance</div>
          <div className="font-semibold text-slate-200">{Math.round(breakdown.distanceScore * 100)}%</div>
        </div>
        <div className="bg-slate-800/40 rounded-lg p-2">
          <div className="text-slate-400 mb-0.5">Repeat</div>
          <div className="font-semibold text-slate-200">{Math.round(breakdown.repeatCustomerScore * 100)}%</div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect?.(providerId)}
        className="w-full mt-4 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
      >
        <Award className="w-4 h-4" />
        <span>View Recommended Services</span>
      </button>
    </div>
  );
};
