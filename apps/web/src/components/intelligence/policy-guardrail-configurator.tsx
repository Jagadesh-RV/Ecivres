import React, { useState } from 'react';

export const PolicyGuardrailConfigurator: React.FC = () => {
  const [maxSurge, setMaxSurge] = useState(50);
  const [dailyBudget, setDailyBudget] = useState(10000);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
      <h3 className="text-lg font-semibold text-blue-400 mb-4">Autonomous Policy Guardrail Configuration</h3>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Strict Max Surge Limit (%)</label>
          <input
            type="number"
            value={maxSurge}
            onChange={(e) => setMaxSurge(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Max Autonomous Daily Budget Limit ($)</label>
          <input
            type="number"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-2 rounded transition"
        >
          {saved ? 'Guardrails Saved Successfully!' : 'Save Guardrails Policy'}
        </button>
      </div>
    </div>
  );
};
