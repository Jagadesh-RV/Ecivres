'use client';

import React, { useState } from 'react';
import { Box, Eye, Smartphone, Sparkles, Check } from 'lucide-react';

interface ArServicePreviewWidgetProps {
  serviceName?: string;
  arModelUrl?: string;
  onLaunchAr?: () => void;
}

export const ArServicePreviewWidget: React.FC<ArServicePreviewWidgetProps> = ({
  serviceName = 'Custom Living Room Furniture Assembly',
  arModelUrl = 'https://models.ecivres.com/ar/sofa.usdz',
  onLaunchAr,
}) => {
  const [active, setActive] = useState(false);

  const handleLaunch = () => {
    setActive(true);
    onLaunchAr?.();
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold">Augmented Reality (AR) Preview</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
          ARKit / ARCore
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Simulate how {serviceName} will fit in your space in real time using your smartphone camera before booking!
      </p>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">3D Spatial Model Ready</div>
            <div className="text-[10px] text-slate-400">iOS Quick Look USDZ / Android WebXR</div>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <Eye className="w-4 h-4" />
          <span>{active ? 'AR Active' : 'Launch 3D Room View'}</span>
        </button>
      </div>
    </div>
  );
};
