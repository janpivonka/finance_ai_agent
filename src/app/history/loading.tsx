import React from "react";
import { Skeleton } from "../components/ui/Skeleton";
import { PageBackground } from "../components/ui/PageBackground";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-6 relative overflow-hidden">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-full h-96", opacity: "opacity-10", animate: true }
        ]}
      />
      
      <div className="mx-auto max-w-4xl relative z-10 flex flex-col gap-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-32" variant="text" />
            <Skeleton className="h-12 w-64" variant="text" />
            <Skeleton className="h-4 w-96" variant="text" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-48 rounded-2xl" />
            <Skeleton className="h-12 w-32 rounded-2xl" />
          </div>
        </div>

        {/* List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-6 p-6 rounded-[1.8rem] bg-[var(--panel)] border border-[color:var(--panel-border)] shadow-lg">
              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-5 w-48" variant="text" />
                <Skeleton className="h-3 w-32" variant="text" />
              </div>
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
