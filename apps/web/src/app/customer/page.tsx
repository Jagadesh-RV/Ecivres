"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Star } from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuthStore();

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", { limit: 4 }],
    queryFn: async () => {
      const { data } = await client.get("/categories?limit=4");
      return data.data; // assuming paginated response
    },
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", { limit: 3 }],
    queryFn: async () => {
      const { data } = await client.get("/services?limit=3");
      return data.data; // assuming paginated response
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.firstName || "Customer"}!</h1>
        <p className="text-muted-foreground mt-2">Here is a quick overview of what's new on EcivreS.</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Categories</h2>
          <Link href="/customer/categories" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map((cat: any) => (
              <Link key={cat.id} href={`/customer/services?categoryId=${cat.id}`}>
                <div className="group cursor-pointer rounded-2xl border bg-card p-6 text-center hover:border-primary hover:shadow-md transition-all h-full flex flex-col justify-center">
                  <h3 className="font-semibold">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Latest Services</h2>
          <Link href="/customer/services" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {isLoadingServices ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services?.map((service: any) => (
              <Link key={service.id} href={`/customer/services/${service.id}`}>
                <Card className="overflow-hidden hover:border-primary transition-colors cursor-pointer h-full">
                  <CardHeader className="p-4 bg-muted/30">
                    <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
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
        )}
      </section>
    </div>
  );
}
