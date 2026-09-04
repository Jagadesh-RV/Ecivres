"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { CategoryManagementGrid, CategoryItem } from "../../../components/admin/CategoryManagementGrid";
import { CreateCategoryModal } from "../../../components/admin/CreateCategoryModal";
import { Button } from "../../../components/ui/button";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (name: string, description: string) => {
    try {
      await client.post("/categories", { name, description });
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await client.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Category Catalog Management</h2>
          <p className="text-xs text-gray-500 mt-1">Publish new marketplace categories or modify existing listings.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          + Add New Category
        </Button>
      </div>

      <CategoryManagementGrid
        categories={categories}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
