import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProviderBookingRowProps {
  booking: any;
  onUpdateStatus: (id: string, status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED") => void;
  isUpdating: boolean;
}

export function ProviderBookingRow({ booking, onUpdateStatus, isUpdating }: ProviderBookingRowProps) {
  const isPending = booking.status === "PENDING";
  const isConfirmed = booking.status === "CONFIRMED";
  const isCompleted = booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";

  const getStatusColor = () => {
    if (isPending) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (isConfirmed) return "bg-blue-100 text-blue-800 border-blue-200";
    if (isCompleted) return "bg-green-100 text-green-800 border-green-200";
    if (isCancelled) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const customerName = booking.customer?.customerProfile
    ? `${booking.customer.customerProfile.firstName} ${booking.customer.customerProfile.lastName}`
    : "Unknown Customer";

  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor()} border`}>
            {booking.status}
          </Badge>
          <span className="text-sm font-medium text-foreground">
            {booking.service.name}
          </span>
          <span className="text-xs text-muted-foreground">
            #{booking.id.slice(0, 8)}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>{format(new Date(booking.scheduledAt), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{format(new Date(booking.scheduledAt), "p")}</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-wrap gap-2 justify-start md:justify-end shrink-0">
        {isPending && (
          <>
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(booking.id, "CANCELLED")} disabled={isUpdating}>
              Reject
            </Button>
            <Button size="sm" onClick={() => onUpdateStatus(booking.id, "CONFIRMED")} disabled={isUpdating}>
              Confirm
            </Button>
          </>
        )}
        {isConfirmed && (
          <>
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(booking.id, "CANCELLED")} disabled={isUpdating}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => onUpdateStatus(booking.id, "COMPLETED")} disabled={isUpdating}>
              Mark Completed
            </Button>
          </>
        )}
        {isCompleted && (
          <span className="text-sm text-green-600 font-medium px-2 py-1 bg-green-50 rounded-md">
            Completed Successfully
          </span>
        )}
        {isCancelled && (
          <span className="text-sm text-red-600 font-medium px-2 py-1 bg-red-50 rounded-md">
            Cancelled
          </span>
        )}
      </div>
    </div>
  );
}
