"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { subject: string; description: string; priority: string; bookingId?: string }) => Promise<void>;
}

export function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ subject, description, priority, bookingId: bookingId || undefined });
      setSubject("");
      setDescription("");
      setBookingId("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 backdrop-blur-xs rounded-2xl">
        <DialogHeader>
          <DialogTitle>Open Support Ticket / Dispute</DialogTitle>
          <DialogDescription>Submit your issue or dispute to our 24/7 customer resolution team.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Booking Cancellation Dispute"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookingId">Booking ID (Optional)</Label>
            <Input
              id="bookingId"
              placeholder="e.g. bk_1024"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Urgency Level</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="LOW">Low - General Inquiry</option>
              <option value="MEDIUM">Medium - Standard Request</option>
              <option value="HIGH">High - Urgent Issue</option>
              <option value="URGENT">Urgent - Financial Dispute</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Issue Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe your issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
