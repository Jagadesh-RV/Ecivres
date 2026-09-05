"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminHeader onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />
      <div className="flex flex-1 relative">
        <AdminSidebar
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
