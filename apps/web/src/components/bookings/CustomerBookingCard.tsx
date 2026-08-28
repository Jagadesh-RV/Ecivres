import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, DollarSign, User, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ReviewModal } from "../reviews/ReviewModal";

interface CustomerBookingCardProps {
  booking: any;
  onCancel?: (id: string) => void;
}

export function CustomerBookingCard({ booking, onCancel }: CustomerBookingCardProps) {
  const isPending = booking.status === "PENDING";
  const isConfirmed = booking.status === "CONFIRMED";
  const isCompleted = booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";
  
  const [isReviewOpen, setIsReviewOpen] = useState(false);

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
          <Badge className={`${getStatusColor()} border hover:bg-opacity-80`}>
            {booking.status}
          </Badge>
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
    </div>
  );
}
