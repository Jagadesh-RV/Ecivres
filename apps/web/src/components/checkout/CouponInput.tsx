"use client";

import React, { useState } from "react";
import { client } from "../../lib/axios";
import { Button } from "../ui/button";

interface CouponInputProps {
  bookingAmount: number;
  onApplyCoupon: (appliedCoupon: {
    code: string;
    discountAmount: number;
    finalAmount: number;
  }) => void;
  onRemoveCoupon: () => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  bookingAmount,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [applied, setApplied] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsValidating(true);
    setError("");

    try {
      const res = await client.post("/coupons/validate", {
        code: code.trim(),
        bookingAmount,
      });

      const couponData = {
        code: res.data.code,
        discountAmount: res.data.discountAmount,
        finalAmount: res.data.finalAmount,
      };

      setApplied(couponData);
      onApplyCoupon(couponData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid promotional code");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    setError("");
    onRemoveCoupon();
  };

  if (applied) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="text-emerald-600 text-base">🏷️</span>
          <div>
            <p className="text-xs font-bold text-emerald-900">
              Code &apos;{applied.code}&apos; Applied!
            </p>
            <p className="text-xs text-emerald-700">
              Saved ${applied.discountAmount.toFixed(2)} on this booking
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleValidate} className="flex space-x-2">
        <input
          type="text"
          placeholder="Promo code (e.g. WELCOME10)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
        />
        <Button type="submit" disabled={isValidating || !code.trim()} size="sm">
          {isValidating ? "Validating..." : "Apply"}
        </Button>
      </form>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
