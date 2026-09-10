'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Users, DollarSign, Award } from 'lucide-react';

interface ReferralDashboardProps {
  referralCode?: string;
  totalReferrals?: number;
  totalEarnings?: number;
  onRedeem?: (code: string) => void;
}

export const ReferralDashboard: React.FC<ReferralDashboardProps> = ({
  referralCode = 'REF-A1B2C3',
  totalReferrals = 5,
  totalEarnings = 75.0,
  onRedeem,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onRedeem?.(inputCode.trim());
      setInputCode('');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 border border-indigo-500/20 shadow-2xl text-white">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Gift className="w-4 h-4 text-indigo-400" />
            <span>EcivreS Referral Rewards Program</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Invite Friends, Earn $15 for Every Service
          </h2>
          <p className="text-sm text-slate-300">
            Share your unique referral link with friends. When they complete their first service booking, you both get $15 in credit.
          </p>

          {/* Copy Box */}
          <div className="flex items-center gap-2 pt-2 max-w-md">
            <div className="flex-1 px-4 py-3 bg-slate-950/80 rounded-xl border border-indigo-500/40 font-mono text-lg font-bold text-indigo-300 text-center tracking-wider">
              {referralCode}
            </div>
            <button
              onClick={handleCopy}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Successful Referrals</div>
            <div className="text-2xl font-bold text-white mt-0.5">{totalReferrals} Friends</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Rewards Earned</div>
            <div className="text-2xl font-bold text-white mt-0.5">${totalEarnings.toFixed(2)}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Current Status</div>
            <div className="text-2xl font-bold text-purple-400 mt-0.5">VIP Ambassador</div>
          </div>
        </div>
      </div>

      {/* Redeem Promo Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Have a Referral Code?</h3>
        <form onSubmit={handleRedeemSubmit} className="flex gap-3 max-w-md">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter referral code (e.g. REF-X9Y8Z7)"
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl text-white text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputCode.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition-colors"
          >
            Redeem $15
          </button>
        </form>
      </div>
    </div>
  );
};
