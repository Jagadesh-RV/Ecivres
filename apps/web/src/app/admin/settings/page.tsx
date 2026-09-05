"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/axios";
import { PlatformCommissionForm } from "@/components/admin/PlatformCommissionForm";
import { MaintenanceModeToggleCard } from "@/components/admin/MaintenanceModeToggleCard";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to load platform settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveCommission = async (data: any) => {
    const res = await client.patch("/settings/admin", data);
    setSettings(res.data);
  };

  const handleToggleMaintenance = async (maintenanceMode: boolean) => {
    const res = await client.patch("/settings/admin", { maintenanceMode });
    setSettings(res.data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">System Platform Configuration</h2>
        <p className="text-xs text-gray-500 mt-1">Manage global commission rules, withdrawal limits, banners, and emergency maintenance controls.</p>
      </div>

      <MaintenanceModeToggleCard
        initialMaintenanceMode={settings?.maintenanceMode || false}
        onToggle={handleToggleMaintenance}
      />

      <PlatformCommissionForm
        initialFee={settings?.platformFeePercentage || 10}
        initialMinPayout={settings?.payoutMinimumThreshold || 50}
        initialAnnouncement={settings?.systemAnnouncementMessage || ""}
        onSave={handleSaveCommission}
      />
    </div>
  );
}
