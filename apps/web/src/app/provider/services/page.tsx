"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyServicesPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["provider-services"],
    queryFn: async () => {
      const { data } = await client.get("/services/provider/me");
      return data; 
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
          <p className="text-muted-foreground mt-2">Manage your service listings.</p>
        </div>
        <Link href="/provider/services/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Service
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service: any) => (
            <Link key={service.id} href={`/provider/services/${service.id}/edit`}>
              <Card className="overflow-hidden hover:border-primary transition-colors cursor-pointer h-full flex flex-col">
                <CardHeader className="p-4 bg-muted/30 flex flex-row items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>${service.price}</span>
                    <span className="text-muted-foreground">{service.duration} mins</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {services?.length === 0 && (
            <div className="col-span-full py-24 text-center border rounded-xl border-dashed">
              <p className="text-muted-foreground mb-4">You haven't created any services yet.</p>
              <Link href="/provider/services/create">
                <Button variant="outline">Create your first service</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
