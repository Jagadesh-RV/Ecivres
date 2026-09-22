import React, { useState } from 'react';

export const IdentityDocumentUploadPortal: React.FC = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [gst, setGst] = useState('');

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 max-w-lg">
      <h3 className="text-lg font-bold text-slate-900">Government Identity Portal</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Aadhaar Number (12 Digits)</label>
          <input value={aadhaar} onChange={e => setAadhaar(e.target.value)} maxLength={12} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="1234 5678 9012" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">PAN Card Number</label>
          <input value={pan} onChange={e => setPan(e.target.value)} maxLength={10} className="w-full px-3 py-2 border rounded-lg text-sm uppercase" placeholder="ABCDE1234F" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">GSTIN Number</label>
          <input value={gst} onChange={e => setGst(e.target.value)} maxLength={15} className="w-full px-3 py-2 border rounded-lg text-sm uppercase" placeholder="27ABCDE1234F1Z5" />
        </div>
      </div>
      <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">Submit Verification</button>
    </div>
  );
};
