import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api/reviews";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ReviewListProps {
  serviceId: string;
}

export function ReviewList({ serviceId }: ReviewListProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["service-reviews", serviceId],
    queryFn: () => reviewsApi.getServiceReviews(serviceId),
  });

  if (isLoading) {
    return <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse flex gap-4">
          <div className="h-10 w-10 bg-muted rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>;
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground italic text-sm">No reviews yet for this service.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">Customer Reviews ({reviews.length})</h3>
      
      <div className="space-y-6">
        {reviews.map((review: any) => {
          const author = review.author?.customerProfile;
          const name = author ? `${author.firstName} ${author.lastName}` : "Anonymous";
          const initials = author ? `${author.firstName[0]}${author.lastName[0]}` : "?";

          return (
            <div key={review.id} className="flex gap-4">
              <Avatar className="h-10 w-10 mt-1">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                
                {review.comment && (
                  <p className="text-sm text-foreground mt-2">{review.comment}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
