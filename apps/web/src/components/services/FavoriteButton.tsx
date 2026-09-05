"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { client } from "@/lib/axios";

interface FavoriteButtonProps {
  serviceId: string;
  initialIsFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({ serviceId, initialIsFavorite = false, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      const res = await client.post("/favorites/toggle", { serviceId });
      const newState = res.data.isFavorite;
      setIsFavorite(newState);
      if (onToggle) onToggle(newState);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      aria-label="Save to Favorites"
      className={`p-2.5 rounded-full transition-all border ${
        isFavorite
          ? "bg-red-50 text-red-500 border-red-200"
          : "bg-white/80 text-gray-400 border-gray-200 hover:text-red-500 hover:bg-white"
      }`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
    </button>
  );
}
