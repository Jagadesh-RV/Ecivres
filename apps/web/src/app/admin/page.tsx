"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, AdminUser, Category } from "@/lib/api/admin";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Shield, 
  CheckCircle, 
  Trash2, 
  Plus, 
  Users, 
  Layers, 
  Award, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase 
} from "lucide-react";

type TabType = "users" | "verifications" | "categories";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("verifications");
  
  // Category creation fields
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Queries
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminApi.getUsers,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminApi.getCategories,
  });

  // Mutations
  const verifyMutation = useMutation({
    mutationFn: adminApi.verifyProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Provider verified successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify provider.");
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category created successfully.");
      setCatName("");
      setCatDesc("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category.");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category.");
    },
  });

  // Derived stats
  const totalUsersCount = users?.length || 0;
  
  const pendingProviders = users?.filter(
    (u) => u.providerProfile && !u.providerProfile.isVerified
  ) || [];
  
  const verifiedProvidersCount = users?.filter(
    (u) => u.providerProfile && u.providerProfile.isVerified
  ).length || 0;

  const totalCategoriesCount = categories?.length || 0;

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error("Category name is required.");
      return;
    }
    createCategoryMutation.mutate({ name: catName, description: catDesc });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-56 h-56 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            System Administration
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Control Center</h1>
          <p className="text-white/80 max-w-xl">
            Moderate categories, approve and verify service providers, and manage user memberships.
          </p>
        </div>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          <CardContent className="flex items-center gap-5 p-6">
            <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalUsersCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          <CardContent className="flex items-center gap-5 p-6">
            <div className="p-4 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{pendingProviders.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-sky-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          <CardContent className="flex items-center gap-5 p-6">
            <div className="p-4 rounded-xl bg-sky-50 text-sky-600">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Categories</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalCategoriesCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("verifications")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "verifications"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          <Award className="w-4 h-4" />
          Provider Verifications
          {pendingProviders.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
              {pendingProviders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "categories"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          <Layers className="w-4 h-4" />
          Category Management
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "users"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          <Users className="w-4 h-4" />
          User Directory
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* PANEL: PROVIDER VERIFICATION */}
        {activeTab === "verifications" && (
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Pending Approvals</CardTitle>
              <CardDescription>
                Review and approve provider profiles to list them publicly on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : pendingProviders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-gray-900">All caught up!</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    No pending provider profiles require verification.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-sm font-semibold text-muted-foreground">
                        <th className="pb-3">Business Profile</th>
                        <th className="pb-3">Owner Contact</th>
                        <th className="pb-3">Location Details</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {pendingProviders.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4">
                            <div>
                              <p className="font-bold text-gray-900">
                                {u.providerProfile?.businessName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {u.providerProfile?.description || "No business description provided."}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="space-y-0.5">
                              <p className="flex items-center gap-1.5 text-xs text-gray-700">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {u.email}
                              </p>
                              {u.providerProfile?.phone && (
                                <p className="flex items-center gap-1.5 text-xs text-gray-700">
                                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                                  {u.providerProfile.phone}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="flex items-center gap-1.5 text-xs text-gray-700">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              {u.providerProfile?.address || "Address not provided"}
                            </p>
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              onClick={() => verifyMutation.mutate(u.providerProfile!.id)}
                              disabled={verifyMutation.isPending}
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                            >
                              Verify Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* PANEL: CATEGORIES MANAGEMENT */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List Tab */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl border border-gray-100 shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Category Listings</CardTitle>
                  <CardDescription>
                    All active service categories currently available to search and book.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-14 w-full rounded-xl" />
                      <Skeleton className="h-14 w-full rounded-xl" />
                    </div>
                  ) : categories?.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed">
                      <p className="text-sm text-muted-foreground">No categories registered yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-sm font-semibold text-muted-foreground">
                            <th className="pb-3">Category Name</th>
                            <th className="pb-3">Services Count</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                          {categories?.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4">
                                <div>
                                  <p className="font-bold text-gray-900">{cat.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {cat.description || "No description provided."}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 text-gray-700">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                  {cat._count?.services ?? 0} Services
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${cat.name}"?`)) {
                                      deleteCategoryMutation.mutate(cat.id);
                                    }
                                  }}
                                  disabled={deleteCategoryMutation.isPending}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Create Tab Form */}
            <div>
              <Card className="rounded-2xl border border-gray-100 shadow-sm sticky top-6 bg-gradient-to-br from-indigo-50/20 to-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Add Category</CardTitle>
                  <CardDescription>
                    Create a new service catalog segment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Category Name</label>
                      <Input
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="e.g. Plumbing, Cleaning"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Description</label>
                      <Input
                        value={catDesc}
                        onChange={(e) => setCatDesc(e.target.value)}
                        placeholder="Brief summary of category scope"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={createCategoryMutation.isPending}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm mt-2"
                    >
                      {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* PANEL: USER DIRECTORY */}
        {activeTab === "users" && (
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">User Directory</CardTitle>
              <CardDescription>
                A unified listing of all accounts registered within the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-sm font-semibold text-muted-foreground">
                        <th className="pb-3">User info</th>
                        <th className="pb-3">Profile Status</th>
                        <th className="pb-3">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {users?.map((u) => {
                        const rolesList = u.userRoles.map((ur) => ur.role.name);
                        const hasCustomer = !!u.customerProfile;
                        const hasProvider = !!u.providerProfile;

                        return (
                          <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4">
                              <div>
                                <p className="font-bold text-gray-900">
                                  {hasCustomer 
                                    ? `${u.customerProfile?.firstName} ${u.customerProfile?.lastName}`
                                    : hasProvider 
                                      ? u.providerProfile?.businessName
                                      : "System User"
                                  }
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                  <Mail className="w-3 h-3" />
                                  {u.email}
                                </p>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex gap-1.5 flex-wrap">
                                {rolesList.map((r) => (
                                  <span
                                    key={r}
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      r === "ADMIN"
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : r === "PROVIDER"
                                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                          : "bg-blue-50 text-blue-700 border border-blue-200"
                                    }`}
                                  >
                                    {r}
                                  </span>
                                ))}
                                {hasProvider && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    u.providerProfile?.isVerified
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}>
                                    {u.providerProfile?.isVerified ? "Verified Provider" : "Pending Verification"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 text-muted-foreground flex items-center gap-1.5 mt-2">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
