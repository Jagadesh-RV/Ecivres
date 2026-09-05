"use client";

import React from "react";
import { Input } from "@/components/ui/input";

export interface ScheduleDay {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  slotDurationMinutes?: number;
}

interface ScheduleRuleCardProps {
  dayRule: ScheduleDay;
  onChange: (updatedRule: ScheduleDay) => void;
}

export function ScheduleRuleCard({ dayRule, onChange }: ScheduleRuleCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={dayRule.isOpen}
          onChange={(e) => onChange({ ...dayRule, isOpen: e.target.checked })}
          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="font-bold text-sm w-28 uppercase">{dayRule.day}</span>
      </div>

      {dayRule.isOpen ? (
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={dayRule.openTime}
            onChange={(e) => onChange({ ...dayRule, openTime: e.target.value })}
            className="w-32 h-9 text-xs"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="time"
            value={dayRule.closeTime}
            onChange={(e) => onChange({ ...dayRule, closeTime: e.target.value })}
            className="w-32 h-9 text-xs"
          />
        </div>
      ) : (
        <span className="text-xs text-muted-foreground italic">Closed / Day Off</span>
      )}
    </div>
  );
}
