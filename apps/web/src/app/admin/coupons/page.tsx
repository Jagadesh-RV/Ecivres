"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { CouponManagementTable } from "../../../components/admin/CouponManagementTable";
import { CreateCouponModal } from "../../../components/admin/CreateCouponModal";
import { Button } from "../../../components/ui/button";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoupons = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await client.get("/coupons/all");
      setCoupons(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load promo codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this coupon code?")) return;
    try {
      await client.patch(`/coupons/${id}/deactivate`);
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to deactivate coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions & Coupons</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage promotional codes, percentage discounts, and redemptions.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          + Create New Promo Code
        </Button>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          Loading promo codes...
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-xs text-gray-500">No promo codes found.</p>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            Create Your First Coupon
          </Button>
        </div>
      ) : (
        <CouponManagementTable coupons={coupons} onDeactivate={handleDeactivate} />
      )}

      <CreateCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCoupons}
      />
    </div>
  );
}
