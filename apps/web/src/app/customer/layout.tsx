"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";
import { CustomerSidebar } from "../../components/customer/CustomerSidebar";
import { CustomerHeader } from "../../components/customer/CustomerHeader";
import { client } from "../../lib/axios";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Fetch unread notifications count
      client
        .get("/notifications/unread-count")
        .then((res) => setUnreadCount(res.data?.count || 0))
        .catch(() => setUnreadCount(0));
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerHeader onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />
      <div className="flex flex-1 relative">
        <CustomerSidebar
          unreadCount={unreadCount}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
