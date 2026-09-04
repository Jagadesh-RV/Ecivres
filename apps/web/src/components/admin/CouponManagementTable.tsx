"use client";

import React from "react";

export interface CouponData {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minBookingAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

interface CouponManagementTableProps {
  coupons: CouponData[];
  onDeactivate: (id: string) => void;
}

export const CouponManagementTable: React.FC<CouponManagementTableProps> = ({
  coupons,
  onDeactivate,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-wider text-[11px] font-bold text-gray-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Discount Value</th>
              <th className="px-4 py-3">Min Booking</th>
              <th className="px-4 py-3">Usage Count</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 font-bold text-gray-900">{coupon.code}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      coupon.discountType === "PERCENTAGE"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {coupon.discountType}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-semibold text-gray-800">
                  {coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue.toFixed(2)}`}
                </td>
                <td className="px-4 py-3.5 text-gray-600">
                  {coupon.minBookingAmount ? `$${coupon.minBookingAmount}` : "None"}
                </td>
                <td className="px-4 py-3.5 text-gray-600">
                  {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "uses"}
                </td>
                <td className="px-4 py-3.5">
                  {coupon.isActive ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-bold text-[10px]">
                      Disabled
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right">
                  {coupon.isActive && (
                    <button
                      onClick={() => onDeactivate(coupon.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
