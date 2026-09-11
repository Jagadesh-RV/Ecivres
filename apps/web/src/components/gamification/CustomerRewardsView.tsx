'use client';

import React from 'react';
import { Flame, Trophy, Award, Crown, Star, Sparkles, ChevronRight } from 'lucide-react';

export interface RewardsProfile {
  points: number;
  streakDays: number;
  vipTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM_VIP';
  badges: { id: string; name: string; icon: string }[];
  nextTierPointsNeeded: number;
}

interface CustomerRewardsViewProps {
  profile?: RewardsProfile;
}

export const CustomerRewardsView: React.FC<CustomerRewardsViewProps> = ({
  profile = {
    points: 1850,
    streakDays: 5,
    vipTier: 'SILVER',
    badges: [
      { id: 'b1', name: 'First Booking', icon: '🎉' },
      { id: 'b2', name: 'Home Care Pro', icon: '🏡' },
      { id: 'b3', name: '5-Star Reviewer', icon: '⭐' },
    ],
    nextTierPointsNeeded: 650,
  },
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-purple-500/30 p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{profile.vipTier} Member</span>
            </div>
            <h2 className="text-3xl font-extrabold">{profile.points.toLocaleString()} Loyalty Points</h2>
            <p className="text-xs text-slate-300">
              {profile.nextTierPointsNeeded > 0
                ? `${profile.nextTierPointsNeeded} points to unlock GOLD tier privileges`
                : 'Highest VIP tier unlocked! Enjoy 15% discount on all bookings.'}
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold">
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>{profile.streakDays} Day Streak!</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-6">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-400"
            style={{ width: `${Math.min(100, (profile.points / 2500) * 100)}%` }}
          />
        </div>
      </div>

      {/* Badges Collection */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Achievement Badges</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile.badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3"
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <div className="text-xs font-bold text-white">{b.name}</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Unlocked</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
