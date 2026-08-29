"use client";

import Link from "next/link";
import { useAuthStore } from "../../stores/auth-store";
import { Button } from "../ui/button";
import { UserNav } from "./UserNav";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const getDashboardLink = () => {
    if (user?.role === "PROVIDER") return "/provider";
    return "/customer";
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          EcivreS
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <UserNav />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
