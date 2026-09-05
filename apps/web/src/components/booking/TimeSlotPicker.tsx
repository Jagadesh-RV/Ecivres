"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface TimeSlotOption {
  time: string; // "09:00"
  label: string; // "09:00 AM"
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlotOption[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Available Time Slots</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.time;
          return (
            <Button
              key={slot.time}
              type="button"
              variant={isSelected ? "default" : "outline"}
              disabled={!slot.available}
              onClick={() => onSelectSlot(slot.time)}
              className={`h-11 text-xs font-semibold ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : slot.available
                  ? "hover:border-primary"
                  : "opacity-40 cursor-not-allowed bg-muted"
              }`}
            >
              {slot.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
