"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "../../../lib/axios";
import { RatingStars } from "../../../components/ui/RatingStars";
import { FavoriteButton } from "../../../components/ui/FavoriteButton";
import { ServiceFilterBar } from "../../../components/services/ServiceFilterBar";
import { CategoryFilterPills } from "../../../components/catalog/CategoryFilterPills";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  provider?: {
    businessName: string;
  };
}

export default function CustomerServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await client.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategoryId !== "all") params.categoryId = selectedCategoryId;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const res = await client.get("/services", { params });
      setServices(res.data || []);
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [search, selectedCategoryId, minPrice, maxPrice, sortBy]);

  const handleReset = () => {
    setSearch("");
    setSelectedCategoryId("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Services Marketplace</h2>
        <p className="text-xs text-gray-500 mt-1">Search and book verified professionals for your home & business.</p>
      </div>

      <CategoryFilterPills
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <ServiceFilterBar
        search={search}
        onSearchChange={setSearch}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onResetFilters={handleReset}
      />

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
          No services match your filters. Try adjusting price range or category selection!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {item.provider?.businessName || "Verified Provider"}
                  </span>
                  <FavoriteButton
                    serviceId={item.id}
                    onToggle={(isFav) =>
                      alert(
                        isFav
                          ? `Saved "${item.name}" to your Favorites!`
                          : `Removed "${item.name}" from Favorites.`
                      )
                    }
                  />
                </div>

                <h3 className="text-base font-bold text-gray-900 mt-3">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-3">
                  <RatingStars rating={4.8} />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 ml-1">/ {item.duration} mins</span>
                </div>
                <Link
                  href={`/customer/services/${item.id}`}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
