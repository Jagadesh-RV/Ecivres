"use client";

import React from "react";
import Link from "next/link";

export interface ProviderServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category?: {
    name: string;
  };
}

interface ProviderServicesTableProps {
  services: ProviderServiceItem[];
  onEditService?: (service: ProviderServiceItem) => void;
  onDeleteService?: (id: string, name: string) => void;
}

export const ProviderServicesTable: React.FC<ProviderServicesTableProps> = ({
  services,
  onEditService,
  onDeleteService,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Active Service Offerings</h3>
          <p className="text-xs text-gray-500">List of services currently available for customer booking.</p>
        </div>
        <Link
          href="/provider/services/create"
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
        >
          + Add New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No services published yet. Click "+ Add New Service" to list your first offering!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">Service Name</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Duration</th>
                <th className="px-6 py-3 font-semibold">Price</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    <div>
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500 font-normal line-clamp-1">{s.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {s.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.duration} mins</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${s.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {onEditService ? (
                      <button
                        onClick={() => onEditService(s)}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                    ) : (
                      <Link
                        href={`/provider/services/${s.id}/edit`}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Edit
                      </Link>
                    )}
                    {onDeleteService && (
                      <button
                        onClick={() => onDeleteService(s.id, s.name)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
