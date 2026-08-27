"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await client.get("/categories");
      return data.data; // paginated
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-2">Browse all service categories.</p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((cat: any) => (
            <Link key={cat.id} href={`/customer/services?categoryId=${cat.id}`}>
              <div className="group cursor-pointer rounded-2xl border bg-card p-6 text-center hover:border-primary hover:shadow-md transition-all h-full flex flex-col justify-center">
                <h3 className="font-semibold">{cat.name}</h3>
                {cat.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
                )}
              </div>
            </Link>
          ))}
          {categories?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No categories found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
