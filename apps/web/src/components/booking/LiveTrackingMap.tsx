'use client';

import React from 'react';
import { MapPin, Navigation, Clock, ShieldCheck } from 'lucide-react';

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

interface LiveTrackingMapProps {
  customerLocation: MapCoordinates;
  providerLocation?: MapCoordinates;
  providerName?: string;
  formattedEta?: string;
  distanceKm?: number;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  customerLocation,
  providerLocation,
  providerName = 'Service Provider',
  formattedEta = '12 mins',
  distanceKm = 3.5,
}) => {
  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      {/* Simulated Map Radar Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Top Status Banner */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between p-3.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold">{providerName} is on the way</div>
            <div className="text-xs text-slate-400">{distanceKm} km away from your location</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Clock className="w-3.5 h-3.5" />
          <span>ETA: {formattedEta}</span>
        </div>
      </div>

      {/* Visual Canvas Representation */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Customer Marker */}
        <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75" />
            <div className="p-2.5 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-semibold border border-slate-700">
            Your Location
          </span>
        </div>

        {/* Provider Live Marker */}
        {providerLocation && (
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-indigo-400 opacity-75" />
              <div className="p-2.5 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <Navigation className="w-5 h-5 transform rotate-45" />
              </div>
            </div>
            <span className="mt-1 px-2 py-0.5 rounded bg-slate-900 text-indigo-300 text-[10px] font-semibold border border-indigo-500/40">
              {providerName}
            </span>
          </div>
        )}

        {/* Simulated Route Dashed Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="33%"
            y1="33%"
            x2="75%"
            y2="50%"
            stroke="#6366F1"
            strokeWidth="3"
            strokeDasharray="6,6"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Bottom Safety Info */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Live Encrypted Telemetry</span>
      </div>
    </div>
  );
};
