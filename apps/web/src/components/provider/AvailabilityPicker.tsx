"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface AvailabilityPickerProps {
  initialSchedule?: DaySchedule[];
  onSave?: (schedule: DaySchedule[]) => Promise<void>;
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: "MONDAY", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  { day: "TUESDAY", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  { day: "WEDNESDAY", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  { day: "THURSDAY", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  { day: "FRIDAY", isOpen: true, openTime: "09:00", closeTime: "17:00" },
  { day: "SATURDAY", isOpen: false, openTime: "10:00", closeTime: "15:00" },
  { day: "SUNDAY", isOpen: false, openTime: "10:00", closeTime: "15:00" },
];

export const AvailabilityPicker: React.FC<AvailabilityPickerProps> = ({
  initialSchedule = DEFAULT_SCHEDULE,
  onSave,
}) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].isOpen = !updated[index].isOpen;
    setSchedule(updated);
  };

  const handleTimeChange = (index: number, field: "openTime" | "closeTime", value: string) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    setIsSaving(true);
    setMessage("");

    try {
      await onSave(schedule);
      setMessage("Operating availability schedule saved successfully!");
    } catch {
      setMessage("Failed to update availability schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-bold text-gray-900">Weekly Operating Hours</h3>
        <p className="text-xs text-gray-500">Configure your business working days and customer booking hours.</p>
      </div>

      {message && (
        <div className="p-3 text-xs bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {schedule.map((item, idx) => (
            <div
              key={item.day}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                item.isOpen ? "bg-white" : "bg-gray-50/70"
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={item.isOpen}
                  onChange={() => handleToggleDay(idx)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className={`text-xs font-bold ${item.isOpen ? "text-gray-900" : "text-gray-400"}`}>
                  {item.day}
                </span>
              </div>

              {item.isOpen ? (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500">From:</span>
                  <input
                    type="time"
                    value={item.openTime}
                    onChange={(e) => handleTimeChange(idx, "openTime", e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <span className="text-gray-400">To:</span>
                  <input
                    type="time"
                    value={item.closeTime}
                    onChange={(e) => handleTimeChange(idx, "closeTime", e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              ) : (
                <span className="text-xs text-gray-400 font-semibold italic">Closed for bookings</span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <Button type="submit" disabled={isSaving} size="sm">
            {isSaving ? "Saving Schedule..." : "Save Operating Schedule"}
          </Button>
        </div>
      </form>
    </div>
  );
};
