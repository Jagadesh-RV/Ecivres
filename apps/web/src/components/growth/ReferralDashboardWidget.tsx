import React from 'react';

interface ReferralDashboardWidgetProps {
  referralCode: string;
  qrCodeUrl: string;
  totalEarnedUsd: number;
  successfulInvitesCount: number;
}

export const ReferralDashboardWidget: React.FC<ReferralDashboardWidgetProps> = ({
  referralCode,
  qrCodeUrl,
  totalEarnedUsd,
  successfulInvitesCount,
}) => {
  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg space-y-6 border border-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-100">Invite Friends & Earn Rewards</h3>
          <p className="text-sm text-slate-400">Get $15 for every friend who completes their first booking!</p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800 rounded-full">VIRAL GROWTH</span>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-800/80 rounded-lg">
        {qrCodeUrl && <img src={qrCodeUrl} alt="Referral QR Code" className="w-28 h-28 rounded-md shadow-md border border-slate-700" />}
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-xs text-slate-400">Your Unique Invite Code</p>
          <p className="text-2xl font-mono font-bold text-sky-400 tracking-wider">{referralCode}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Total Rewards Earned</p>
          <p className="text-xl font-bold text-emerald-400">${totalEarnedUsd}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Successful Invites</p>
          <p className="text-xl font-bold text-sky-400">{successfulInvitesCount}</p>
        </div>
      </div>
    </div>
  );
};
