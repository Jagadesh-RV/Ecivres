"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { useAuthStore } from "../../stores/auth-store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const CustomerSettingsForm: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.customerProfile?.firstName || "");
  const [lastName, setLastName] = useState(user?.customerProfile?.lastName || "");
  const [phone, setPhone] = useState(user?.customerProfile?.phone || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setIsUpdatingProfile(true);

    try {
      const response = await client.patch("/users/profiles/customer", {
        firstName,
        lastName,
        phone,
      });
      updateUser(response.data);
      setProfileSuccess("Profile details updated successfully!");
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Failed to update profile details");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");
    setIsUpdatingPassword(true);

    try {
      await client.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Details Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-1">Personal Details</h3>
        <p className="text-xs text-gray-500 mb-6">Update your account identity and contact information.</p>

        {profileSuccess && (
          <div className="p-3 mb-4 text-xs text-green-700 bg-green-50 rounded-lg border border-green-200 font-medium">
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200 font-medium">
            {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-semibold text-gray-700">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-semibold text-gray-700">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Saving..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-1">Security & Password</h3>
        <p className="text-xs text-gray-500 mb-6">Ensure your account uses a strong, unique password.</p>

        {passwordSuccess && (
          <div className="p-3 mb-4 text-xs text-green-700 bg-green-50 rounded-lg border border-green-200 font-medium">
            {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200 font-medium">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-xs font-semibold text-gray-700">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-semibold text-gray-700">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="outline" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
