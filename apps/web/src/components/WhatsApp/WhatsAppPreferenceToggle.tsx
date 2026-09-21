import React, { useState } from 'react';

export const WhatsAppPreferenceToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-slate-900">WhatsApp Booking Alerts</h4>
        <p className="text-xs text-slate-500">Receive real-time booking status & provider arrival alerts via WhatsApp.</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
          enabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {enabled ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  );
};
