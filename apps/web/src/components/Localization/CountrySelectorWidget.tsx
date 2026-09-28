import React, { useState } from 'react';

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD ($)' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR (₹)' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP (£)' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED (AED)' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR (€)' },
];

export const CountrySelectorWidget: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 cursor-pointer hover:bg-slate-800 transition">
        <span>{selectedCountry.flag}</span>
        <span>{selectedCountry.name}</span>
        <span className="text-slate-400 font-mono">({selectedCountry.currency})</span>
      </div>
    </div>
  );
};
