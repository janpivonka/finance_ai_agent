import React from "react";
import { Skeleton } from "../../components/ui/Skeleton";
import { PageBackground } from "../../components/ui/PageBackground";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-16 pb-24 relative overflow-hidden flex flex-col">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-cyan-600", size: "w-[600px] h-[600px]", opacity: "opacity-5" }
        ]}
        withNoise
      />
      
      <div className="mx-auto max-w-5xl w-full relative z-10 flex flex-col gap-12">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-40" variant="text" />
          <Skeleton className="h-16 w-80 md:w-[500px]" variant="text" />
          <Skeleton className="h-4 w-full max-w-2xl" variant="text" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Left Card Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-[450px] w-full rounded-[3rem]" />
            <Skeleton className="h-40 w-full rounded-[2rem]" />
          </div>

          {/* Right Form Skeleton */}
          <div className="lg:col-span-2">
            <Skeleton className="h-[700px] w-full rounded-[3rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
