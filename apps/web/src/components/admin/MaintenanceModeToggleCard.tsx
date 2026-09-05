"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface MaintenanceModeToggleCardProps {
  initialMaintenanceMode: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
}

export function MaintenanceModeToggleCard({ initialMaintenanceMode, onToggle }: MaintenanceModeToggleCardProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    const nextState = !maintenanceMode;
    if (nextState && !confirm("Are you sure you want to enable System Maintenance Mode? Customer bookings will be temporarily paused.")) {
      return;
    }

    try {
      setIsUpdating(true);
      await onToggle(nextState);
      setMaintenanceMode(nextState);
    } catch (err) {
      alert("Failed to toggle maintenance mode");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${maintenanceMode ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">System Maintenance Mode</h3>
          <p className="text-xs text-muted-foreground">
            {maintenanceMode
              ? "Platform is currently in MAINTENANCE mode. New bookings are paused."
              : "Platform is ONLINE and operating normally."}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Status: {maintenanceMode ? "Active" : "Disabled"}
        </span>
        <Button
          variant={maintenanceMode ? "default" : "destructive"}
          onClick={handleToggle}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
        </Button>
      </div>
    </div>
  );
}
