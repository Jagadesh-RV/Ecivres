"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";
import { ProviderBookingRow } from "@/components/bookings/ProviderBookingRow";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

export default function ProviderBookingsPage() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: bookingsApi.getProviderBookings,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" }) =>
      bookingsApi.updateBookingStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      toast.success(`Booking ${variables.status.toLowerCase()} successfully.`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update booking status.");
    },
    onSettled: () => {
      setUpdatingId(null);
    },
  });

  const handleUpdateStatus = (id: string, status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED") => {
    setUpdatingId(id);
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incoming Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Manage service requests from your customers.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        ) : bookings?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground">When customers book your services, they will appear here.</p>
          </div>
        ) : (
          bookings?.map((booking: any) => (
            <ProviderBookingRow
              key={booking.id}
              booking={booking}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updatingId === booking.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
