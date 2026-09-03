"use client";

import React, { useState } from "react";

interface FavoriteButtonProps {
  serviceId: string;
  initialIsFavorite?: boolean;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  serviceId,
  initialIsFavorite = false,
  onToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    if (onToggle) onToggle(nextState);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Save to favorites"
      className={`p-2 rounded-full transition-all duration-200 shadow-sm ${
        isFavorite
          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 scale-110"
          : "bg-white/80 text-gray-400 border border-gray-200 hover:text-red-500 hover:bg-white"
      }`}
    >
      <span className="text-base">{isFavorite ? "❤️" : "🤍"}</span>
    </button>
  );
};
