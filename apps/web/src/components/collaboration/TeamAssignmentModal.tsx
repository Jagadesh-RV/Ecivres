'use client';

import React, { useState } from 'react';
import { Users, UserPlus, DollarSign, CheckCircle2, Shield } from 'lucide-react';

export interface TeamMemberShare {
  providerId: string;
  providerName: string;
  role: 'LEAD' | 'SPECIALIST' | 'APPRENTICE';
  percentageShare: number;
  calculatedPayout: number;
}

interface TeamAssignmentModalProps {
  totalPayout?: number;
  members?: TeamMemberShare[];
  onAssignTeam?: (members: TeamMemberShare[]) => void;
}

export const TeamAssignmentModal: React.FC<TeamAssignmentModalProps> = ({
  totalPayout = 1200,
  members = [
    { providerId: 'p1', providerName: 'Marcus Vance (Lead)', role: 'LEAD', percentageShare: 50, calculatedPayout: 600 },
    { providerId: 'p2', providerName: 'David Sterling (HVAC)', role: 'SPECIALIST', percentageShare: 30, calculatedPayout: 360 },
    { providerId: 'p3', providerName: 'Elena Rostova (Electrical)', role: 'SPECIALIST', percentageShare: 20, calculatedPayout: 240 },
  ],
  onAssignTeam,
}) => {
  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-5 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold">Multi-Provider Team Assignment</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
          Total Payout: ${totalPayout}
        </span>
      </div>

      <div className="space-y-3">
        {members.map((m) => (
          <div
            key={m.providerId}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{m.providerName}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                  {m.role}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{m.percentageShare}% Revenue Split</div>
            </div>

            <div className="text-right">
              <div className="text-base font-extrabold text-emerald-400">${m.calculatedPayout}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Direct Payout</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onAssignTeam?.(members)}
        className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Confirm Team Assignment & Revenue Share</span>
      </button>
    </div>
  );
};
