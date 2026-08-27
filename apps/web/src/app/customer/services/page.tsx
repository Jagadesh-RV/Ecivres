"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", categoryId],
    queryFn: async () => {
      const url = categoryId ? `/services?categoryId=${categoryId}` : "/services";
      const { data } = await client.get(url);
      return data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground mt-2">Browse and discover top-rated services.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
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
            <Link key={service.id} href={`/customer/services/${service.id}`}>
              <Card className="overflow-hidden hover:border-primary transition-colors cursor-pointer h-full flex flex-col">
                <CardHeader className="p-4 bg-muted/30">
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
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No services found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
