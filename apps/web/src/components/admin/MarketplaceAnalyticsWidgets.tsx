"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../lib/axios";

export const MarketplaceAnalyticsWidgets: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await client.get("/admin/marketplace-metrics");
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load marketplace metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-xs text-gray-500">
        Loading real-time marketplace analytics...
      </div>
    );
  }

  const byStatus = metrics?.bookings?.byStatus || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Marketplace Monitoring & Metrics</h3>
          <p className="text-xs text-gray-500">Live booking counts, completion rates, and platform volume</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
          Live System Health 100%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-amber-700 block">Pending Requests</span>
          <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
            {byStatus.PENDING || 0}
          </span>
          <span className="text-[10px] text-amber-700 block mt-1">Awaiting provider action</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-blue-700 block">Confirmed Bookings</span>
          <span className="text-2xl font-extrabold text-blue-900 mt-1 block">
            {byStatus.CONFIRMED || 0}
          </span>
          <span className="text-[10px] text-blue-700 block mt-1">Scheduled & locked</span>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-indigo-700 block">In Progress Jobs</span>
          <span className="text-2xl font-extrabold text-indigo-900 mt-1 block">
            {byStatus.IN_PROGRESS || 0}
          </span>
          <span className="text-[10px] text-indigo-700 block mt-1">Actively fulfilling</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-emerald-700 block">Completed Jobs</span>
          <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
            {byStatus.COMPLETED || 0}
          </span>
          <span className="text-[10px] text-emerald-700 block mt-1">Settled & paid</span>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-rose-700 block">Cancelled Orders</span>
          <span className="text-2xl font-extrabold text-rose-900 mt-1 block">
            {byStatus.CANCELLED || 0}
          </span>
          <span className="text-[10px] text-rose-700 block mt-1">Refunded / released</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block">Marketplace Completion Rate</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2 block">
            {metrics?.bookings?.completionRate || 0}%
          </span>
          <p className="text-xs text-gray-500 mt-2">
            Percentage of total created bookings successfully completed.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block">Total Active Supply & Demand</span>
          <div className="flex items-center justify-between mt-3 text-xs">
            <div>
              <span className="text-gray-400 block">Customers</span>
              <span className="text-lg font-bold text-gray-900">{metrics?.marketplace?.totalCustomers || 0}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Providers</span>
              <span className="text-lg font-bold text-gray-900">{metrics?.marketplace?.totalProviders || 0}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Services</span>
              <span className="text-lg font-bold text-gray-900">{metrics?.marketplace?.totalServices || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block">Platform Revenue Cut (10%)</span>
          <span className="text-3xl font-extrabold text-emerald-600 mt-2 block">
            ${(metrics?.revenue?.platformCommission || 0).toFixed(2)}
          </span>
          <p className="text-xs text-gray-500 mt-2">
            Net commission earned from gross volume of ${(metrics?.revenue?.grossVolume || 0).toFixed(2)}.
          </p>
        </div>
      </div>
    </div>
  );
};
