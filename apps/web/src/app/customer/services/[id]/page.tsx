"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, DollarSign, User } from "lucide-react";
import Link from "next/link";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

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

  if (!service) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold">Service not found</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">Go Back</Button>
      </div>
    );
  }

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
            <Button size="lg" className="w-full md:w-auto px-12">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
