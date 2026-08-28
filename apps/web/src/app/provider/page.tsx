"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { bookingsApi } from "@/lib/api/bookings";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PlusCircle, Activity, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProviderDashboard() {
  const { user } = useAuthStore();

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["provider-services"],
    queryFn: async () => {
      const { data } = await client.get("/services/provider/me");
      return data; 
    },
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: bookingsApi.getProviderBookings,
  });

  const pendingBookings = bookings?.filter((b: any) => b.status === "PENDING") || [];
  
  // A naive "today" filter
  const todayAppointments = bookings?.filter((b: any) => {
    if (b.status !== "CONFIRMED") return false;
    const d = new Date(b.scheduledAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingServices ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{services?.length || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{pendingBookings.length}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{todayAppointments.length}</div>}
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Services</h2>
          <Link href="/provider/services/create">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> New Service
            </Button>
          </Link>
        </div>
        
        {isLoadingServices ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2].map(i => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service: any) => (
              <Link key={service.id} href={`/provider/services/${service.id}/edit`}>
                <Card className="overflow-hidden hover:border-primary transition-colors cursor-pointer h-full">
                  <CardHeader className="p-4 bg-muted/30 flex flex-row items-start justify-between">
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
            {services?.length === 0 && (
              <div className="col-span-full py-12 text-center border rounded-xl border-dashed">
                <p className="text-muted-foreground mb-4">You haven't created any services yet.</p>
                <Link href="/provider/services/create">
                  <Button variant="outline">Create your first service</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
