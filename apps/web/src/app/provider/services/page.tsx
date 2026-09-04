"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ProviderServicesTable, ProviderServiceItem } from "../../../components/provider/ProviderServicesTable";
import { EditServiceModal } from "../../../components/services/EditServiceModal";
import { DeleteServiceModal } from "../../../components/services/DeleteServiceModal";

export default function ProviderServicesPage() {
  const [services, setServices] = useState<ProviderServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingService, setEditingService] = useState<ProviderServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<{ id: string; name: string } | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/services");
      setServices(res.data || []);
    } catch (err) {
      console.error("Failed to load provider services", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleStartDelete = (id: string, name: string) => {
    setDeletingService({ id, name });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Service Offerings</h2>
        <p className="text-xs text-gray-500 mt-1">Manage your active service catalog, pricing, and duration.</p>
      </div>

      <ProviderServicesTable
        services={services}
        onEditService={(svc) => setEditingService(svc)}
        onDeleteService={handleStartDelete}
      />

      {editingService && (
        <EditServiceModal
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSuccess={fetchServices}
        />
      )}

      {deletingService && (
        <DeleteServiceModal
          serviceId={deletingService.id}
          serviceName={deletingService.name}
          isOpen={!!deletingService}
          onClose={() => setDeletingService(null)}
          onSuccess={fetchServices}
        />
      )}
    </div>
  );
}
