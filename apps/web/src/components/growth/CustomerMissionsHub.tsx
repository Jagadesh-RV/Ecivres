'use client';

import React, { useState } from 'react';
import { Target, Trophy, Award, CheckCircle2, ArrowRight, Gift, Sparkles, Flame } from 'lucide-react';

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardPoints: number;
  isCompleted: boolean;
  type: 'BOOKING_COUNT' | 'REFERRAL_STREAK' | 'REVIEW_SERIES' | 'SEASONAL';
}

interface CustomerMissionsHubProps {
  missions?: MissionItem[];
  onClaimReward?: (missionId: string) => void;
}

export const CustomerMissionsHub: React.FC<CustomerMissionsHubProps> = ({
  missions = [
    {
      id: 'm1',
      title: 'Spring Home Refresh',
      description: 'Book 2 cleaning or maintenance services this month',
      targetCount: 2,
      currentCount: 1,
      rewardPoints: 500,
      isCompleted: false,
      type: 'SEASONAL',
    },
    {
      id: 'm2',
      title: 'Viral Advocate',
      description: 'Successfully refer 3 friends to EcivreS',
      targetCount: 3,
      currentCount: 2,
      rewardPoints: 1000,
      isCompleted: false,
      type: 'REFERRAL_STREAK',
    },
    {
      id: 'm3',
      title: 'Community Feedback',
      description: 'Leave 3 detailed reviews with photos',
      targetCount: 3,
      currentCount: 3,
      rewardPoints: 300,
      isCompleted: true,
      type: 'REVIEW_SERIES',
    },
  ],
  onClaimReward,
}) => {
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const handleClaim = (id: string) => {
    onClaimReward?.(id);
    setClaimedIds((prev) => [...prev, id]);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Missions & Weekly Challenges</span>
          </div>
          <h2 className="text-2xl font-bold">Earn Loyalty Points & Special Perks</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>Active Streak Bonus Active</span>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {missions.map((m) => {
          const progressPercent = Math.min(100, Math.round((m.currentCount / m.targetCount) * 100));
          const isClaimed = claimedIds.includes(m.id);

          return (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                    {m.type}
                  </span>
                  <span className="text-xs font-extrabold text-amber-400">+{m.rewardPoints} Pts</span>
                </div>
                <h3 className="text-base font-bold text-white">{m.title}</h3>
                <p className="text-xs text-slate-400">{m.description}</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Progress</span>
                    <span>
                      {m.currentCount} / {m.targetCount}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${m.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {m.isCompleted ? (
                  <button
                    onClick={() => handleClaim(m.id)}
                    disabled={isClaimed}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isClaimed
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isClaimed ? 'Reward Claimed' : 'Claim Reward Points'}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 text-center text-xs text-slate-500 font-semibold bg-slate-950 rounded-xl">
                    In Progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
