"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { client } from "@/lib/axios";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
    provider?: { businessName: string };
  };
}

export function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const router = useRouter();
  const [scheduledDate, setScheduledDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate) {
      setError("Please select a booking date");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const fullDateTime = `${scheduledDate}T${timeSlot}:00Z`;

      const res = await client.post("/bookings", {
        serviceId: service.id,
        scheduledAt: fullDateTime,
        notes: notes || undefined,
      });

      const bookingId = res.data.id;
      onClose();
      router.push(`/customer/bookings/${bookingId}/confirmation`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create booking. Please choose another time slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 backdrop-blur-xs rounded-2xl">
        <DialogHeader>
          <DialogTitle>Book Service Appointment</DialogTitle>
          <DialogDescription>Schedule your appointment with {service.provider?.businessName || "Verified Provider"}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="p-3 bg-muted/40 rounded-xl space-y-1">
            <h4 className="font-bold text-sm">{service.name}</h4>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {service.duration} minutes</span>
              <span className="font-bold text-primary text-sm">${service.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Appointment Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full h-10 px-3 rounded-md border text-sm bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Select Time Window</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full h-10 px-3 rounded-md border text-sm bg-background"
            >
              <option value="09:00">09:00 AM - 10:00 AM</option>
              <option value="10:00">10:00 AM - 11:00 AM</option>
              <option value="11:00">11:00 AM - 12:00 PM</option>
              <option value="13:00">01:00 PM - 02:00 PM</option>
              <option value="14:00">02:00 PM - 03:00 PM</option>
              <option value="15:00">03:00 PM - 04:00 PM</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Special Notes / Instructions (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Gate code, pet instructions, specific requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-md border text-sm bg-background"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Confirming Booking..." : "Confirm & Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
