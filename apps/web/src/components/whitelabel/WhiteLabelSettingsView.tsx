'use client';

import React, { useState } from 'react';
import { Palette, Globe, Check, Settings2, Sliders } from 'lucide-react';

interface WhiteLabelSettingsViewProps {
  brandName?: string;
  customDomain?: string;
  primaryColor?: string;
  onSave?: (name: string, domain: string, color: string) => void;
}

export const WhiteLabelSettingsView: React.FC<WhiteLabelSettingsViewProps> = ({
  brandName = 'Urban Fix Pro',
  customDomain = 'services.urbanfix.com',
  primaryColor = '#059669',
  onSave,
}) => {
  const [name, setName] = useState(brandName);
  const [domain, setDomain] = useState(customDomain);
  const [color, setColor] = useState(primaryColor);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(name, domain, color);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold">White-Label Custom Branding</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
          Multi-Tenant Active
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Partner Marketplace Brand Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Custom Domain Mapping</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Primary Theme Color Hex</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Settings2 className="w-4 h-4" />}
          <span>{saved ? 'Branding Configurations Saved' : 'Save White-Label Branding'}</span>
        </button>
      </form>
    </div>
  );
};
