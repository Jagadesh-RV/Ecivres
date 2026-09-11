'use client';

import React, { useState } from 'react';
import { Wallet, CreditCard, Gift, Users, ArrowUpRight, Plus, Check } from 'lucide-react';

interface EcivresWalletViewProps {
  balance?: number;
  cashbackEarned?: number;
  onTopUp?: (amount: number) => void;
  onRedeemGiftCard?: (code: string) => void;
}

export const EcivresWalletView: React.FC<EcivresWalletViewProps> = ({
  balance = 245.5,
  cashbackEarned = 38.0,
  onTopUp,
  onRedeemGiftCard,
}) => {
  const [giftCode, setGiftCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCode.trim()) return;
    onRedeemGiftCard?.(giftCode);
    setRedeemed(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Hero Wallet Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-indigo-400" />
              <span>EcivreS Digital Wallet Balance</span>
            </div>
            <div className="text-4xl font-extrabold tracking-tight">${balance.toFixed(2)}</div>
            <div className="text-xs text-indigo-200">Includes ${cashbackEarned.toFixed(2)} total cashback earned</div>
          </div>

          <button
            onClick={() => onTopUp?.(50)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Top Up $50</span>
          </button>
        </div>
      </div>

      {/* Gift Card & Split Payment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gift Card Redeemer */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <span>Redeem Gift Card</span>
          </h3>
          <form onSubmit={handleRedeem} className="flex gap-2">
            <input
              type="text"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              placeholder="e.g. ECV-X89A12"
              className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              {redeemed ? 'Redeemed!' : 'Redeem'}
            </button>
          </form>
        </div>

        {/* Split Bill Info */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Split Payment & EMI</span>
          </h3>
          <p className="text-xs text-slate-400">
            Split high-value service bills with roommates or choose 0% EMI installment plans over 3, 6, or 12 months.
          </p>
        </div>
      </div>
    </div>
  );
};
