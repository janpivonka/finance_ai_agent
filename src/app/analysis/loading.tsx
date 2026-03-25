import React from "react";
import { Skeleton } from "../components/ui/Skeleton";
import { PageBackground } from "../components/ui/PageBackground";

export default function AnalysisLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-8 md:px-12 relative overflow-hidden">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-96 h-96", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-cyan-600", size: "w-96 h-96", opacity: "opacity-5", animate: true, delay: "2s" }
        ]}
      />
      
      <div className="mx-auto max-w-6xl flex flex-col gap-12 relative z-10">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" variant="text" />
          <Skeleton className="h-12 w-64" variant="text" />
          <Skeleton className="h-4 w-96" variant="text" />
        </div>

        {/* Upload Area Skeleton */}
        <div className="flex-1 min-h-[400px]">
          <Skeleton className="h-full w-full rounded-[3rem]" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-[2.2rem]" />
          <Skeleton className="h-48 w-full rounded-[2.2rem]" />
          <Skeleton className="h-48 w-full rounded-[2.2rem]" />
        </div>
      </div>
    </div>
  );
}
