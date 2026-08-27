"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: async () => {
      // Backend actually uses /providers/:id if we built it. Let's assume it exists or use users endpoint.
      // Wait, in Phase 4 there was `ProviderProfile` mapped to the user.
      const { data } = await client.get(`/providers/${id}`);
      return data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-6 w-1/3 mt-4" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold">Provider not found</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="-ml-4 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="border-0 shadow-md">
        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center shrink-0">
            <UserCircle2 className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{provider.user?.firstName} {provider.user?.lastName}</h1>
            <p className="text-muted-foreground">{provider.bio || "No biography provided."}</p>
            <div className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Verified Professional
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-8">
        <h2 className="text-2xl font-bold mb-6">Services by {provider.user?.firstName}</h2>
        {provider.services?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {provider.services.map((service: any) => (
               <Link key={service.id} href={`/customer/services/${service.id}`}>
                 <Card className="overflow-hidden hover:border-primary transition-colors cursor-pointer h-full flex flex-col">
                   <CardHeader className="p-4 bg-muted/30">
                     <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 flex-1 flex flex-col justify-between">
                     <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
                     <div className="flex justify-between items-center text-sm font-medium">
                       <span>${service.price}</span>
                       <span className="text-muted-foreground">{service.duration} mins</span>
                     </div>
                   </CardContent>
                 </Card>
               </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">This provider has not listed any services yet.</p>
        )}
      </div>
    </div>
  );
}
