"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { useAuthStore } from "../../stores/auth-store";
import { Button } from "../ui/button";

interface ProfileEditFormProps {
  initialFirstName?: string;
  initialLastName?: string;
  initialPhone?: string;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialFirstName = "",
  initialLastName = "",
  initialPhone = "",
}) => {
  const { fetchCurrentUser } = useAuthStore();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(initialPhone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await client.patch("/users/profiles/customer", {
        firstName,
        lastName,
        phone,
      });
      await fetchCurrentUser();
      setMessage({ text: "Profile details updated successfully!", type: "success" });
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 max-w-2xl">
      <div>
        <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
        <p className="text-xs text-gray-500">Update your name and primary contact details for booking receipts.</p>
      </div>

      {message && (
        <div
          className={`p-3 text-xs rounded-lg border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="pt-2 text-right">
          <Button type="submit" disabled={isSubmitting} size="sm">
            {isSubmitting ? "Saving Changes..." : "Save Profile Details"}
          </Button>
        </div>
      </form>
    </div>
  );
};
