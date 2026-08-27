"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "../../lib/schemas";
import { client } from "../../lib/axios";
import { useAuthStore } from "../../stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ProfileSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser, user } = useAuthStore();
  const [error, setError] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">(
    (searchParams.get("role")?.toUpperCase() as any) || "CUSTOMER"
  );

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError("");
      const endpoint = role === "CUSTOMER" ? "/users/profiles/customer" : "/users/profiles/provider";
      const response = await client.post(endpoint, data);
      
      // Update user state with new profile and role
      updateUser(response.data);
      
      if (role === "PROVIDER") {
        router.push("/provider");
      } else {
        router.push("/customer");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Profile setup failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Complete your profile</CardTitle>
          <CardDescription>Tell us a bit more about yourself to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            {!user?.role || user.role === "USER" ? (
              <div className="flex gap-4 mb-6">
                <Button 
                  type="button" 
                  variant={role === "CUSTOMER" ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setRole("CUSTOMER")}
                >
                  Customer
                </Button>
                <Button 
                  type="button" 
                  variant={role === "PROVIDER" ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setRole("PROVIDER")}
                >
                  Provider
                </Button>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                {...register("address")}
                className={errors.address ? "border-red-500" : ""}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete Setup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
