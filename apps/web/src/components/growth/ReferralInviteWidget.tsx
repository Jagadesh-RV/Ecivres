'use client';

import React, { useState } from 'react';
import { Share2, QrCode, Copy, Check, MessageSquare, Mail, Gift, Sparkles } from 'lucide-react';

interface ReferralInviteWidgetProps {
  referralCode?: string;
  qrCodeUrl?: string;
  shareMessage?: string;
  onSendInvite?: (channel: 'WHATSAPP' | 'SMS' | 'EMAIL') => void;
}

export const ReferralInviteWidget: React.FC<ReferralInviteWidgetProps> = ({
  referralCode = 'ECV-ALEX-9102',
  qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://ecivres.com/invite?code=ECV-ALEX-9102',
  shareMessage = 'Join me on EcivreS! Use code ECV-ALEX-9102 for $25 off your first booking.',
  onSendInvite,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-5 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold">Invite Friends & Earn $25</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
          Unlimited Rewards
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Share your unique referral code with friends. They get $25 off their first service, and you get $25 wallet credit when they complete a booking!
      </p>

      {/* Code Display & Action */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Your Referral Code</div>
          <div className="text-xl font-extrabold text-indigo-400 tracking-wider">{referralCode}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowQr(!showQr)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Link' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal/Expandable */}
      {showQr && (
        <div className="p-4 rounded-2xl bg-white text-slate-900 flex flex-col items-center space-y-2 shadow-xl animate-fade-in">
          <img src={qrCodeUrl} alt="Referral QR Code" className="w-40 h-40" />
          <span className="text-xs font-bold text-slate-700">Scan to claim $25 credit</span>
        </div>
      )}

      {/* Quick Share Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onSendInvite?.('WHATSAPP')}
          className="p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
        <button
          onClick={() => onSendInvite?.('SMS')}
          className="p-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>SMS Invite</span>
        </button>
        <button
          onClick={() => onSendInvite?.('EMAIL')}
          className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </button>
      </div>
    </div>
  );
};
