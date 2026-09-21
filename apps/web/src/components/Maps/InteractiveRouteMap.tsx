import React from 'react';

interface InteractiveRouteMapProps {
  originAddress: string;
  destinationAddress: string;
  distanceKm: number;
  durationMinutes: number;
}

export const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  originAddress,
  destinationAddress,
  distanceKm,
  durationMinutes,
}) => {
  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl shadow-md space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Routes API Active</span>
        <span className="text-emerald-400 font-semibold">{distanceKm} km ({durationMinutes} mins)</span>
      </div>
      <div className="p-3 bg-slate-800 rounded-lg space-y-1">
        <p className="text-xs text-slate-400 font-medium">FROM: <span className="text-white font-normal">{originAddress}</span></p>
        <p className="text-xs text-slate-400 font-medium">TO: <span className="text-white font-normal">{destinationAddress}</span></p>
      </div>
    </div>
  );
};
