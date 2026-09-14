'use client';

import React from 'react';
import { Bot, Navigation, DollarSign, MessageSquare, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

interface ProviderCopilotPanelProps {
  potentialBoost?: number;
  optimizedTravelMinutes?: number;
  suggestedReply?: string;
  taxWriteOffEstimate?: number;
}

export const ProviderCopilotPanel: React.FC<ProviderCopilotPanelProps> = ({
  potentialBoost = 840,
  optimizedTravelMinutes = 42,
  suggestedReply = 'My standard rate for this service is $120 with 60-day quality guarantee.',
  taxWriteOffEstimate = 1431.4,
}) => {
  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-5 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold">AI Provider Copilot Assistant</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Assistant</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Route Optimization */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Navigation className="w-4 h-4" />
            <span>Route Optimization</span>
          </div>
          <div className="text-xl font-extrabold text-white">{optimizedTravelMinutes} Mins Total</div>
          <div className="text-[11px] text-emerald-400 font-semibold">18% Fuel Saved vs Default Route</div>
        </div>

        {/* Earnings Booster */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>Earnings Booster</span>
          </div>
          <div className="text-xl font-extrabold text-white">+${potentialBoost} / Month</div>
          <div className="text-[11px] text-slate-400">3 AI Schedule Recommendations</div>
        </div>

        {/* Tax Assistant */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Tax Deduction Assistant</span>
          </div>
          <div className="text-xl font-extrabold text-amber-400">${taxWriteOffEstimate.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Estimated Business Expense Write-off</div>
        </div>
      </div>

      {/* Suggested Reply Box */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>AI Suggested Customer Reply</span>
        </div>
        <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800 italic">
          "{suggestedReply}"
        </p>
      </div>
    </div>
  );
};
