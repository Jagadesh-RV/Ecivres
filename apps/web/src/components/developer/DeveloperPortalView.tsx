'use client';

import React, { useState } from 'react';
import { Key, Webhook, Plus, Copy, Check, Code, Shield } from 'lucide-react';

export interface DeveloperKey {
  id: string;
  keyName: string;
  apiKey: string;
  scopes: string[];
  rateLimitPerMinute: number;
}

interface DeveloperPortalViewProps {
  keys?: DeveloperKey[];
  onCreateKey?: (keyName: string) => void;
}

export const DeveloperPortalView: React.FC<DeveloperPortalViewProps> = ({
  keys = [
    {
      id: 'k1',
      keyName: 'Production Marketplace Integration',
      apiKey: 'ecv_live_9812a0f8b192837482910a',
      scopes: ['READ_SERVICES', 'CREATE_BOOKINGS'],
      rateLimitPerMinute: 600,
    },
  ],
  onCreateKey,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [keyName, setKeyName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    onCreateKey?.(keyName);
    setKeyName('');
    setShowModal(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Code className="w-4 h-4" />
            <span>Developer API Platform</span>
          </div>
          <h2 className="text-2xl font-bold">API Keys & Webhooks Portal</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New API Key</span>
        </button>
      </div>

      <div className="space-y-4">
        {keys.map((k) => (
          <div key={k.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{k.keyName}</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{k.rateLimitPerMinute} req/min</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs text-indigo-300">
              <span>{k.apiKey}</span>
              <button className="text-slate-400 hover:text-white">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold">Create API Key</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Key Name</label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Mobile App Backend"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
              >
                Generate Key
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
