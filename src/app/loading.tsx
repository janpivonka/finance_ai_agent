import React from "react";
import { Skeleton } from "./components/ui/Skeleton";
import { PageBackground } from "./components/ui/PageBackground";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-16 pb-24 relative overflow-hidden flex flex-col">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-fuchsia-600", size: "w-[600px] h-[600px]", opacity: "opacity-5" }
        ]}
        withNoise
      />
      
      <div className="mx-auto max-w-6xl w-full relative z-10 flex flex-col gap-12">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-40" variant="text" />
          <Skeleton className="h-16 w-80 md:w-[500px]" variant="text" />
          <Skeleton className="h-4 w-full max-w-2xl" variant="text" />
        </div>

        {/* Action Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />
          ))}
        </div>

        {/* Main Insight Banner Skeleton */}
        <Skeleton className="h-48 w-full rounded-[3rem]" />

        {/* Future Modules Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
