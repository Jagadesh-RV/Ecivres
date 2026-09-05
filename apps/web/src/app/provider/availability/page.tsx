"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { AvailabilityPicker, DaySchedule } from "../../../components/provider/AvailabilityPicker";

export default function ProviderAvailabilityPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/providers/availability");
      setSchedule(res.data || []);
    } catch (err) {
      console.error("Failed to load availability", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleSaveSchedule = async (updatedSchedule: DaySchedule[]) => {
    await client.patch("/providers/availability", { schedule: updatedSchedule });
    fetchAvailability();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Operating Schedule & Time Slot Generator</h2>
        <p className="text-xs text-gray-500 mt-1">Configure weekly working hours and auto-generate client booking slots.</p>
      </div>

      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-800">
        💡 <strong>Pro Tip:</strong> Setting precise operating hours automatically adjusts customer booking slots and prevents double-booking.
      </div>

      <AvailabilityPicker initialSchedule={schedule} onSave={handleSaveSchedule} />
    </div>
  );
}
