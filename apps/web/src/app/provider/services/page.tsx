"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { ProviderServicesTable, ProviderServiceItem } from "../../../components/provider/ProviderServicesTable";
import { CreateServiceModal } from "../../../components/provider/CreateServiceModal";
import { EditServiceModal } from "../../../components/services/EditServiceModal";
import { DeleteServiceModal } from "../../../components/services/DeleteServiceModal";
import { Button } from "../../../components/ui/button";

export default function ProviderServicesPage() {
  const [services, setServices] = useState<ProviderServiceItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProviderServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<{ id: string; name: string } | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [svcRes, catRes] = await Promise.all([
        client.get("/services"),
        client.get("/categories"),
      ]);
      setServices(svcRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error("Failed to load provider services", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Service Offerings</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your active service catalog, pricing, and duration.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
          + Add New Service
        </Button>
      </div>

      <ProviderServicesTable
        services={services}
        onEditService={(svc) => setEditingService(svc)}
        onDeleteService={handleStartDelete}
      />

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        categories={categories}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      {editingService && (
        <EditServiceModal
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSuccess={fetchData}
        />
      )}

      {deletingService && (
        <DeleteServiceModal
          serviceId={deletingService.id}
          serviceName={deletingService.name}
          isOpen={!!deletingService}
          onClose={() => setDeletingService(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
