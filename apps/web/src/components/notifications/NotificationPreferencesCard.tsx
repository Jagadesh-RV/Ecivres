"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../lib/axios";
import { Button } from "../ui/button";

export const NotificationPreferencesCard = () => {
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    pushAlerts: true,
    smsAlerts: false,
    marketingEmails: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await client.get("/notifications/preferences");
        setPrefs(res.data);
      } catch (err) {
        console.error("Failed to load preferences", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      await client.patch("/notifications/preferences", prefs);
      setMessage("Preferences saved successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-xs text-gray-500 py-4">Loading preferences...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
        Notification Delivery Channels
      </h3>

      {message && (
        <div className="p-3 text-xs bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200">
          {message}
        </div>
      )}

      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-semibold text-gray-800">Email Notifications</p>
            <p className="text-[11px] text-gray-500">Booking status changes & payment receipts</p>
          </div>
          <input
            type="checkbox"
            checked={prefs.emailAlerts}
            onChange={() => handleToggle("emailAlerts")}
            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-semibold text-gray-800">In-App & Push Notifications</p>
            <p className="text-[11px] text-gray-500">Real-time chat messages and booking reminders</p>
          </div>
          <input
            type="checkbox"
            checked={prefs.pushAlerts}
            onChange={() => handleToggle("pushAlerts")}
            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-semibold text-gray-800">SMS Text Alerts</p>
            <p className="text-[11px] text-gray-500">Urgent appointment updates sent to phone</p>
          </div>
          <input
            type="checkbox"
            checked={prefs.smsAlerts}
            onChange={() => handleToggle("smsAlerts")}
            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-semibold text-gray-800">Promotions & Marketing</p>
            <p className="text-[11px] text-gray-500">Discount codes, special offers, and platform updates</p>
          </div>
          <input
            type="checkbox"
            checked={prefs.marketingEmails}
            onChange={() => handleToggle("marketingEmails")}
            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </label>
      </div>

      <div className="pt-3 border-t border-gray-100 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="sm">
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};
