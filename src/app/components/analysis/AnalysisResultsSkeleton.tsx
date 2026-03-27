import React from "react";
import { Skeleton } from "../ui/Skeleton";

export const AnalysisResultsSkeleton: React.FC = () => {
  return (
    <div className="pb-20 space-y-12 animate-fade-in">
      {/* Divider */}
      <div className="mb-10 h-px bg-gradient-to-r from-transparent via-[color:var(--panel-border)] to-transparent" />
      
      {/* Header Skeleton */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-4 w-32 rounded-lg" variant="text" />
          </div>
          <Skeleton className="h-12 w-full max-w-lg rounded-2xl" variant="text" />
          <div className="mt-6">
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-32 rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-3xl" />
          </div>
        </div>

        {/* Sidebar Recommendations */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-40 rounded-xl" variant="text" />
          <Skeleton className="h-48 w-full rounded-[2rem]" />
          <Skeleton className="h-48 w-full rounded-[2rem]" />
          <Skeleton className="h-48 w-full rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
};
