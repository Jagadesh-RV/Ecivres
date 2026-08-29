import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, DollarSign, User, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ReviewModal } from "../reviews/ReviewModal";
import { paymentsApi } from "@/lib/api/payments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ShieldCheck } from "lucide-react";

interface CustomerBookingCardProps {
  booking: any;
  onCancel?: (id: string) => void;
}

export function CustomerBookingCard({ booking, onCancel }: CustomerBookingCardProps) {
  const queryClient = useQueryClient();
  const isPending = booking.status === "PENDING";
  const isConfirmed = booking.status === "CONFIRMED";
  const isCompleted = booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";
  
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");

  const payMutation = useMutation({
    mutationFn: () => paymentsApi.payForBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      toast.success("Payment completed successfully!");
      setIsCheckoutOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  });

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    payMutation.mutate();
  };

  const getStatusColor = () => {
    if (isPending) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (isConfirmed) return "bg-blue-100 text-blue-800 border-blue-200";
    if (isCompleted) return "bg-green-100 text-green-800 border-green-200";
    if (isCancelled) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge className={`${getStatusColor()} border hover:bg-opacity-80`}>
              {booking.status}
            </Badge>
            {booking.payment && (
              <Badge className={booking.payment.status === "SUCCESS" 
                ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                : "bg-orange-100 text-orange-800 border-orange-200"
              }>
                {booking.payment.status === "SUCCESS" ? "Paid" : "Unpaid"}
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            Booking #{booking.id.slice(0, 8)}
          </span>
        </div>
        
        <div>
          <Link href={`/customer/services/${booking.serviceId}`}>
            <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">
              {booking.service.name}
            </h3>
          </Link>
          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <User className="h-4 w-4" /> 
            Provider: {booking.service.provider?.businessName || "Unknown Provider"}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>{format(new Date(booking.scheduledAt), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{format(new Date(booking.scheduledAt), "p")}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span>${booking.service.price}</span>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-auto flex sm:flex-col gap-3 justify-end shrink-0">
        {isConfirmed && booking.payment?.status === "PENDING" && (
          <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsCheckoutOpen(true)}>
            Pay Now
          </Button>
        )}
        {(isPending || isConfirmed) && (
          <Button variant="destructive" className="w-full sm:w-auto" onClick={() => onCancel?.(booking.id)}>
            Cancel Booking
          </Button>
        )}
        {isCompleted && !booking.review && (
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsReviewOpen(true)}>
            Leave a Review
          </Button>
        )}
        {isCompleted && booking.review && (
          <Button variant="outline" className="w-full sm:w-auto" disabled>
            Reviewed
          </Button>
        )}
        <Link href={`/customer/services/${booking.serviceId}`}>
          <Button variant="secondary" className="w-full sm:w-auto">
            View Service
          </Button>
        </Link>
      </div>

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        bookingId={booking.id}
        serviceId={booking.serviceId}
        serviceName={booking.service.name}
      />

      {/* Simulated Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <CreditCard className="h-6 w-6 text-primary" />
              Secure Checkout
            </DialogTitle>
            <DialogDescription>
              Complete payment for your service booking with {booking.service.provider?.businessName || "the provider"}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePay} className="space-y-6 mt-4">
            <div className="bg-muted/50 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground">{booking.service.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium text-foreground">{booking.service.provider?.businessName || "Unknown"}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-primary">${booking.service.price}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration Date</Label>
                  <Input
                    id="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Payments are simulated and securely processed.</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={payMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold" disabled={payMutation.isPending}>
                {payMutation.isPending ? "Processing..." : `Pay $${booking.service.price}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
