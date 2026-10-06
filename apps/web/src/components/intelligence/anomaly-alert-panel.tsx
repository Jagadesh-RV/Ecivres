import React, { useState } from 'react';

export const AnomalyAlertPanel: React.FC = () => {
  const [resolved, setResolved] = useState<string[]>([]);

  const alerts = [
    { id: 'alt-101', title: 'Severe Supply Deficit in US-WEST', metric: 'Provider Count', val: '-42%' },
    { id: 'alt-102', title: 'Sudden Cancellation Surge in APAC-1', metric: 'Cancel Rate', val: '+18%' },
  ];

  const handleResolve = (id: string) => {
    setResolved(prev => [...prev, id]);
  };

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
      <h3 className="text-lg font-semibold text-amber-400 mb-4">Real-time Anomaly Alerts & Auto-Remediation</h3>
      <div className="space-y-3">
        {alerts.map(a => {
          const isDone = resolved.includes(a.id);
          return (
            <div key={a.id} className="p-3 bg-slate-800 rounded-lg flex justify-between items-center border border-slate-700">
              <div>
                <div className="font-medium text-slate-200">{a.title}</div>
                <div className="text-xs text-slate-400">{a.metric}: <span className="text-red-400">{a.val}</span></div>
              </div>
              <button
                disabled={isDone}
                onClick={() => handleResolve(a.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  isDone ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isDone ? 'Remediated' : 'Execute Auto-Remediation'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
