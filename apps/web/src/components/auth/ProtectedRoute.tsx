"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";

export function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, isProfileComplete } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isProfileComplete && user?.role !== "ADMIN") {
        router.push("/profile-setup");
      } else if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        // If they have the wrong role, redirect to their own dashboard
        router.push(user.role === "PROVIDER" ? "/provider" : "/customer");
      }
    }
  }, [isLoading, isAuthenticated, isProfileComplete, allowedRoles, user, router]);

  if (isLoading || !isAuthenticated || (!isProfileComplete && user?.role !== "ADMIN")) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
