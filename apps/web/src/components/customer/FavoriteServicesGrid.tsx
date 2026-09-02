"use client";

import React from "react";
import Link from "next/link";
import { RatingStars } from "../ui/RatingStars";

export interface FavoriteServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  provider?: {
    businessName: string;
    rating?: number;
  };
}

interface FavoriteServicesGridProps {
  services: FavoriteServiceItem[];
  onRemoveFavorite?: (id: string) => void;
}

export const FavoriteServicesGrid: React.FC<FavoriteServicesGridProps> = ({
  services,
  onRemoveFavorite,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Saved Favorites</h3>
        <span className="text-xs text-gray-500 font-medium">{services.length} Saved Services</span>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
          No saved favorite services yet. Browse services and click ❤️ to save them!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {item.provider?.businessName || "Verified Provider"}
                  </span>
                  {onRemoveFavorite && (
                    <button
                      onClick={() => onRemoveFavorite(item.id)}
                      className="text-red-500 hover:text-red-700 text-lg transition-transform hover:scale-110"
                      title="Remove from favorites"
                    >
                      ❤️
                    </button>
                  )}
                </div>

                <h4 className="text-base font-bold text-gray-900 mt-3">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>

                {item.provider?.rating !== undefined && (
                  <div className="mt-3">
                    <RatingStars rating={item.provider.rating} />
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 ml-1">/ {item.duration} mins</span>
                </div>
                <Link
                  href={`/services/${item.id}`}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
