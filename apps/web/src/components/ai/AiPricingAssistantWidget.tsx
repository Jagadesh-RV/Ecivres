'use client';

import React, { useState } from 'react';
import { Sparkles, DollarSign, TrendingUp, HelpCircle, Check, ArrowRight } from 'lucide-react';

export interface DynamicPricingData {
  serviceId: string;
  basePrice: number;
  recommendedPrice: number;
  multiplier: number;
  reasoning: string[];
  competitorMin: number;
  competitorMax: number;
  competitorAvg: number;
  estimatedProfitMargin: number;
}

interface AiPricingAssistantWidgetProps {
  pricing?: DynamicPricingData;
  onApplyPrice?: (newPrice: number) => void;
}

export const AiPricingAssistantWidget: React.FC<AiPricingAssistantWidgetProps> = ({
  pricing = {
    serviceId: 'srv_ac_123',
    basePrice: 120,
    recommendedPrice: 145,
    multiplier: 1.21,
    reasoning: [
      'High daytime booking demand (+15%)',
      'Surge regional booking activity (+10%)',
    ],
    competitorMin: 100,
    competitorMax: 170,
    competitorAvg: 135,
    estimatedProfitMargin: 64,
  },
  onApplyPrice,
}) => {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onApplyPrice?.(pricing.recommendedPrice);
    setApplied(true);
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold">AI Dynamic Pricing Assistant</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
          {pricing.multiplier}x Demand Multiplier
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current vs Recommended */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Base List Price</span>
            <span className="font-semibold text-slate-200">${pricing.basePrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-indigo-400">AI Optimal Surge Price</span>
            <span className="text-xl text-emerald-400 font-extrabold">${pricing.recommendedPrice}</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Estimated Profit Margin: <span className="text-emerald-400 font-bold">{pricing.estimatedProfitMargin}%</span>
          </div>
        </div>

        {/* Competitor Benchmark */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold">Competitor Regional Benchmark</div>
          <div className="flex justify-between text-xs text-slate-300 pt-1">
            <span>Min: ${pricing.competitorMin}</span>
            <span className="font-bold text-amber-400">Avg: ${pricing.competitorAvg}</span>
            <span>Max: ${pricing.competitorMax}</span>
          </div>
          {/* Visual Range bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative mt-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* AI Reasoning Points */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400">Why this price point?</div>
        {pricing.reasoning.map((r, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>{r}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        onClick={handleApply}
        disabled={applied}
        className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
          applied
            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
        }`}
      >
        {applied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Dynamic Price Applied (${pricing.recommendedPrice})</span>
          </>
        ) : (
          <>
            <span>Apply Recommended Price (${pricing.recommendedPrice})</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
