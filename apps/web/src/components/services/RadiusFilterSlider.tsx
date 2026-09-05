"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface RadiusFilterSliderProps {
  radiusKm: number;
  onChange: (radius: number) => void;
}

export function RadiusFilterSlider({ radiusKm, onChange }: RadiusFilterSliderProps) {
  return (
    <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-lg border">
      <MapPin className="h-4 w-4 text-primary shrink-0" />
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold w-16 whitespace-nowrap">{radiusKm} km radius</span>
        <input
          type="range"
          min={1}
          max={50}
          value={radiusKm}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
