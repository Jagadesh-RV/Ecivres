"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlatformCommissionFormProps {
  initialFee: number;
  initialMinPayout: number;
  initialAnnouncement: string;
  onSave: (data: { platformFeePercentage: number; payoutMinimumThreshold: number; systemAnnouncementMessage: string }) => Promise<void>;
}

export function PlatformCommissionForm({ initialFee, initialMinPayout, initialAnnouncement, onSave }: PlatformCommissionFormProps) {
  const [fee, setFee] = useState(initialFee);
  const [minPayout, setMinPayout] = useState(initialMinPayout);
  const [announcement, setAnnouncement] = useState(initialAnnouncement);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSave({
        platformFeePercentage: Number(fee),
        payoutMinimumThreshold: Number(minPayout),
        systemAnnouncementMessage: announcement,
      });
      alert("Platform settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Platform Financial & Banner Configuration</h3>
        <p className="text-xs text-muted-foreground mt-1">Configure global service fees, provider withdrawal rules, and platform banner alerts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fee">Platform Commission Fee (%)</Label>
          <Input
            id="fee"
            type="number"
            min={0}
            max={100}
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPayout">Minimum Provider Withdrawal ($)</Label>
          <Input
            id="minPayout"
            type="number"
            min={0}
            value={minPayout}
            onChange={(e) => setMinPayout(Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="announcement">Global System Announcement Banner</Label>
        <Input
          id="announcement"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="e.g. System scheduled maintenance at 02:00 UTC"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving Settings..." : "Save Configuration"}
        </Button>
      </div>
    </form>
  );
}
