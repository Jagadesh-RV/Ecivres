import React from 'react';

interface ProviderVerificationStatusWidgetProps {
  hasAadhaar: boolean;
  hasPan: boolean;
  hasGst: boolean;
  status: string;
}

export const ProviderVerificationStatusWidget: React.FC<ProviderVerificationStatusWidgetProps> = ({
  hasAadhaar,
  hasPan,
  hasGst,
  status,
}) => {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Indian Compliance Verification</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex justify-between"><span>Aadhaar Identification:</span><span className="font-medium">{hasAadhaar ? 'Verified' : 'Pending'}</span></div>
        <div className="flex justify-between"><span>PAN Card:</span><span className="font-medium">{hasPan ? 'Verified' : 'Pending'}</span></div>
        <div className="flex justify-between"><span>GSTIN Tax Filing:</span><span className="font-medium">{hasGst ? 'Verified' : 'Pending'}</span></div>
      </div>
    </div>
  );
};
