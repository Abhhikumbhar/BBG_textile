import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-gray-200 rounded w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left image skeleton */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl bg-gray-200" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-24 rounded-xl bg-gray-200 shrink-0" />
            ))}
          </div>
        </div>

        {/* Right details skeleton */}
        <div className="space-y-6">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-28 bg-amber-50 rounded-2xl border border-amber-100" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-20 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
          <div className="h-14 bg-emerald-100 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
