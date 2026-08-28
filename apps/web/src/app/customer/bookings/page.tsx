"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";
import { CustomerBookingCard } from "@/components/bookings/CustomerBookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CustomerBookingsPage() {
  const queryClient = useQueryClient();
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["customer-bookings"],
    queryFn: bookingsApi.getCustomerBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.updateBookingStatus(id, "CANCELLED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      toast.success("Booking cancelled successfully.");
      setCancelBookingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking.");
    },
  });

  const handleCancelConfirm = () => {
    if (cancelBookingId) {
      cancelMutation.mutate(cancelBookingId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your service appointments.
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </>
        ) : bookings?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground">You haven't booked any services yet.</p>
          </div>
        ) : (
          bookings?.map((booking: any) => (
            <CustomerBookingCard
              key={booking.id}
              booking={booking}
              onCancel={(id) => setCancelBookingId(id)}
            />
          ))
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!cancelBookingId} onOpenChange={(open) => !open && setCancelBookingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setCancelBookingId(null)} disabled={cancelMutation.isPending}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
