"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { client } from "../../../../lib/axios";
import { RatingStars } from "../../../../components/ui/RatingStars";

export default function ProviderPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .get(`/providers/${resolvedParams.id}`)
      .then((res) => setProvider(res.data))
      .catch((err) => console.error("Failed to load provider profile", err))
      .finally(() => setIsLoading(false));
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        Provider profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              {provider.businessName?.substring(0, 2) || "PR"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">{provider.businessName}</h1>
                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                  ✓ Verified Pro
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{provider.address || "Serving local area"}</p>
              <div className="mt-2 flex items-center space-x-2">
                <RatingStars rating={4.9} />
                <span className="text-xs text-gray-500 font-semibold">(48 Verified Reviews)</span>
              </div>
            </div>
          </div>
          <a
            href={`tel:${provider.phone || ""}`}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg hover:bg-indigo-100 transition-colors text-center"
          >
            📞 Contact Business
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">About Business</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {provider.description || "Professional service provider dedicated to delivering high quality workmanship."}
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900">Services Offered by {provider.businessName}</h3>
        {provider.services?.length === 0 ? (
          <p className="text-xs text-gray-400">No services listed yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {provider.services?.map((s: any) => (
              <div key={s.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{s.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.description}</p>
                  <span className="text-[11px] text-gray-400 mt-1 inline-block">{s.duration} mins</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-base font-bold text-gray-900">${s.price?.toFixed(2)}</span>
                  <Link
                    href={`/customer/services/${s.id}`}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
