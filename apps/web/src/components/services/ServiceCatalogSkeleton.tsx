import React from "react";

export function ServiceCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card border rounded-2xl p-5 space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-12 bg-muted rounded w-full"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="h-9 bg-muted rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ServiceCatalogEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="bg-card border rounded-2xl p-12 text-center space-y-4 my-6">
      <div className="text-4xl">🔍</div>
      <h3 className="text-lg font-bold">No Matching Services Found</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        We couldn't find any services matching your search criteria. Try adjusting your keyword or clearing filters.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-2 px-4 py-2 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}
