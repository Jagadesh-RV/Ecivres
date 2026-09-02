"use client";

import React from "react";
import { CustomerSettingsForm } from "../../../components/customer/CustomerSettingsForm";

export default function CustomerSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Account & Security Settings</h2>
        <p className="text-xs text-gray-500 mt-1">Manage your customer profile, contact information, and password.</p>
      </div>

      <CustomerSettingsForm />
    </div>
  );
}
