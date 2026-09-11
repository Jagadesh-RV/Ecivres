'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Package,
  Award,
  DollarSign,
  Calendar,
  Sparkles,
  AlertTriangle,
  Plus,
  Shield,
  Clock,
  PieChart,
} from 'lucide-react';

export interface BusinessSuiteData {
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  occupancyRate: number;
  revenueForecastNextMonth: number;
  cancellationRate: number;
  aiInsights: string[];
}

interface ProviderBusinessSuiteProps {
  analytics?: BusinessSuiteData;
}

export const ProviderBusinessSuite: React.FC<ProviderBusinessSuiteProps> = ({
  analytics = {
    dailyEarnings: 450,
    weeklyEarnings: 2850,
    monthlyEarnings: 11400,
    occupancyRate: 78,
    revenueForecastNextMonth: 13110,
    cancellationRate: 4.2,
    aiInsights: [
      'Your peak demand occurs around 14:00. Consider opening extra slots.',
      'Great job! Your cancellation rate is low (4.2%).',
    ],
  },
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'staff' | 'inventory' | 'portfolio'>('analytics');

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>EcivreS Business Suite</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Enterprise Operations Center</h2>
        </div>

        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {(['analytics', 'staff', 'inventory', 'portfolio'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Daily Earnings</span>
              <div className="text-2xl font-extrabold text-white">${analytics.dailyEarnings}</div>
              <div className="text-[11px] text-emerald-400 font-semibold">↑ +12% vs yesterday</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Weekly Earnings</span>
              <div className="text-2xl font-extrabold text-white">${analytics.weeklyEarnings}</div>
              <div className="text-[11px] text-emerald-400 font-semibold">↑ +8% vs last week</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Monthly Revenue</span>
              <div className="text-2xl font-extrabold text-white">${analytics.monthlyEarnings}</div>
              <div className="text-[11px] text-slate-400">Projected: ${analytics.revenueForecastNextMonth}</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Occupancy Rate</span>
              <div className="text-2xl font-extrabold text-indigo-400">{analytics.occupancyRate}%</div>
              <div className="text-[11px] text-slate-400">Cancellation: {analytics.cancellationRate}%</div>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>AI Business Insights</span>
            </h3>
            <div className="space-y-2">
              {analytics.aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 font-medium"
                >
                  💡 {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Team Members & Schedules</h3>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              + Add Employee
            </button>
          </div>
          <p className="text-xs text-slate-400">Manage employee schedules, shift assignments, and permissions.</p>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Equipment & Inventory Control</h3>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              + Log Supply Item
            </button>
          </div>
          <p className="text-xs text-slate-400">Track stock levels, minimum reorder thresholds, and tax write-offs.</p>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Before/After Gallery & Badges</h3>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              + Upload Work Showcase
            </button>
          </div>
          <p className="text-xs text-slate-400">Showcase high-resolution before/after transformations and verified trade licenses.</p>
        </div>
      )}
    </div>
  );
};
