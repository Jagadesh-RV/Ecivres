"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/customer", label: "Dashboard" },
    { href: "/customer/categories", label: "Categories" },
    { href: "/customer/services", label: "Services" },
    { href: "/customer/bookings", label: "My Bookings" },
  ];

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
