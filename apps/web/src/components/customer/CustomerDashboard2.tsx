'use client';

import React from 'react';
import { Sun, Cloud, Zap, Clock, ShieldAlert, Heart, Calendar } from 'lucide-react';

interface QuickAction {
  label: string;
  action: string;
  query?: string;
}

interface CustomerDashboard2Props {
  salutation?: string;
  weatherContext?: string;
  continueBooking?: { id: string; serviceName: string; status: string } | null;
  quickActions?: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

export const CustomerDashboard2: React.FC<CustomerDashboard2Props> = ({
  salutation = 'Good morning, Alex!',
  weatherContext = 'Hot outside (32°C) — AC maintenance recommended',
  continueBooking,
  quickActions = [
    { label: '⚡ Emergency AC Repair', action: 'SMART_SEARCH', query: 'Emergency AC repair near me' },
    { label: '🚿 Instant Plumbing', action: 'SMART_SEARCH', query: 'Plumbing today' },
  ],
  onActionClick,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Dynamic Weather & Greeting Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 text-white shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>{weatherContext}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{salutation}</h1>
          <p className="text-sm text-slate-300 max-w-lg">
            What service can we help you get done today? Book trusted professionals in under 60 seconds.
          </p>

          {/* Continue Active Booking Bar */}
          {continueBooking && (
            <div className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500 text-white">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs text-indigo-300 font-medium">Ongoing Booking</div>
                  <div className="text-sm font-bold">{continueBooking.serviceName}</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                {continueBooking.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* AI Quick Actions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>AI Quick Actions</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((qa, index) => (
            <button
              key={index}
              onClick={() => onActionClick?.(qa)}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 text-left transition-all group flex items-center justify-between shadow-lg"
            >
              <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400">
                {qa.label}
              </span>
              <ShieldAlert className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
