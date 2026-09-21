import React from 'react';

interface StripeOnboardingBannerProps {
  payoutsEnabled: boolean;
  onboardingUrl?: string;
}

export const StripeOnboardingBanner: React.FC<StripeOnboardingBannerProps> = ({ payoutsEnabled, onboardingUrl }) => {
  if (payoutsEnabled) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Stripe Payouts Active</h4>
          <p className="text-sm text-emerald-600">Your bank account is connected for instant payout settlements.</p>
        </div>
        <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Connected</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-center justify-between">
      <div>
        <h4 className="font-semibold">Complete Stripe Payout Setup</h4>
        <p className="text-sm text-amber-600">Verify your identity and bank details to receive payouts.</p>
      </div>
      <a
        href={onboardingUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium text-sm hover:bg-amber-700 transition"
      >
        Start Express Setup
      </a>
    </div>
  );
};
