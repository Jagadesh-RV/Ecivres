'use client';

import React from 'react';
import { MapPin, TrendingUp, Users, Filter, BarChart3 } from 'lucide-react';

export interface HeatmapPoint {
  zipCode: string;
  regionName: string;
  demandIntensity: number;
  topCategoryNeeded: string;
}

interface MarketplaceIntelligenceWidgetProps {
  points?: HeatmapPoint[];
  conversionRate?: number;
}

export const MarketplaceIntelligenceWidget: React.FC<MarketplaceIntelligenceWidgetProps> = ({
  points = [
    { zipCode: '10001', regionName: 'Manhattan Central', demandIntensity: 92, topCategoryNeeded: 'Emergency Plumbing' },
    { zipCode: '11201', regionName: 'Brooklyn Heights', demandIntensity: 78, topCategoryNeeded: 'House Deep Cleaning' },
    { zipCode: '90210', regionName: 'Beverly Hills', demandIntensity: 85, topCategoryNeeded: 'Smart Home Installation' },
  ],
  conversionRate = 18.5,
}) => {
  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold">Marketplace Demand Heatmaps</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
          {conversionRate}% Conversion Funnel
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {points.map((p) => (
          <div key={p.zipCode} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {p.regionName}
              </span>
              <span className="text-[10px] text-slate-500">{p.zipCode}</span>
            </div>
            <div className="text-lg font-extrabold text-amber-400">{p.demandIntensity}% Demand Surge</div>
            <div className="text-[11px] text-slate-400">Top Need: {p.topCategoryNeeded}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
