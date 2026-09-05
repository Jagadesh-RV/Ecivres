"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Receipt } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export function InvoiceModal({ isOpen, onClose, booking }: InvoiceModalProps) {
  if (!booking) return null;

  const subtotal = booking.service?.price || 120.00;
  const tax = Number((subtotal * 0.085).toFixed(2));
  const platformFee = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax + platformFee).toFixed(2));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 backdrop-blur-xs rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Receipt className="h-5 w-5" />
            <DialogTitle>Official Service Invoice</DialogTitle>
          </div>
          <DialogDescription>Tax invoice & receipt statement for Booking #{booking.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 border-t text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Service Name:</span>
            <span className="font-semibold">{booking.service?.title || "Home Service"}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Date:</span>
            <span>{new Date(booking.scheduledAt || Date.now()).toLocaleDateString()}</span>
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sales Tax (8.5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Fee (5%)</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-base text-gray-900">
              <span>Total Paid</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
