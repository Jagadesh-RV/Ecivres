"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

interface BookingDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export function BookingDatePicker({ selectedDate, onChange, minDate }: BookingDatePickerProps) {
  const min = minDate || new Date().toISOString().split("T")[0];

  return (
    <div className="relative">
      <div className="flex items-center gap-2 border rounded-xl p-2.5 bg-background focus-within:ring-2 focus-within:ring-primary/20">
        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="date"
          min={min}
          value={selectedDate}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs font-semibold bg-transparent border-none focus:outline-none"
        />
      </div>
    </div>
  );
}
