"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, DollarSign, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { bookingsApi } from "@/lib/api/bookings";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const { data } = await client.get(`/services/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold">Service not found</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">Go Back</Button>
      </div>
    );
  }

  const handleBookService = async () => {
    try {
      setIsBookingLoading(true);
      
      // We set scheduledAt to tomorrow at 10 AM by default for this MVP
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(10, 0, 0, 0);

      await bookingsApi.createBooking({
        serviceId: id,
        scheduledAt: date.toISOString(),
      });
      
      toast.success("Booking requested successfully!");
      setIsBookingOpen(false);
      router.push("/customer/bookings");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book service");
    } finally {
      setIsBookingLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="-ml-4 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <div className="h-48 bg-muted/50 flex items-center justify-center">
          <span className="text-muted-foreground">Image Placeholder</span>
        </div>
        <div className="p-8 md:p-12 space-y-8">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {service.category?.name || "Uncategorized"}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{service.name}</h1>
          </div>

          <div className="flex flex-wrap gap-6 py-6 border-y text-muted-foreground">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">${service.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{service.duration} mins</span>
            </div>
            <Link href={`/customer/provider/${service.providerId}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">View Provider</span>
            </Link>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">About this service</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto px-12">
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book Service</DialogTitle>
                  <DialogDescription>
                    Request an appointment for {service.name} with {service.provider?.businessName}.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium text-sm text-muted-foreground mb-1">Appointment Time</p>
                    <p>Tomorrow at 10:00 AM</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: A full calendar and time picker will be available in the next release. For now, this will request an appointment for tomorrow at 10:00 AM.
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
                  <Button onClick={handleBookService} disabled={isBookingLoading}>
                    {isBookingLoading ? "Confirming..." : "Confirm Booking"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
