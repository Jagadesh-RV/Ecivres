"use client";

import React, { useEffect, useState } from "react";
import { client } from "../../../lib/axios";
import { FavoriteServicesGrid, FavoriteServiceItem } from "../../../components/customer/FavoriteServicesGrid";

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const res = await client.get("/services");
      // Pick first 3 as sample saved favorites
      setFavorites(res.data?.slice(0, 3) || []);
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((s) => s.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Saved Favorites</h2>
        <p className="text-xs text-gray-500 mt-1">Quickly access and re-book your favorite service providers.</p>
      </div>

      <FavoriteServicesGrid services={favorites} onRemoveFavorite={handleRemoveFavorite} />
    </div>
  );
}
