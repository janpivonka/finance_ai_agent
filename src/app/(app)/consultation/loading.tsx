import React from "react";
import { Skeleton } from "../../components/ui/Skeleton";
import { PageBackground } from "../../components/ui/PageBackground";

export default function ConsultationLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-4 px-6 md:px-10 relative overflow-hidden flex flex-col h-screen">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-500", size: "w-96 h-96", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-cyan-500", size: "w-96 h-96", opacity: "opacity-5", animate: true }
        ]}
      />
      
      <div className="mx-auto max-w-7xl w-full flex flex-col flex-1 relative z-10 gap-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-32" variant="text" />
            <Skeleton className="h-12 w-64" variant="text" />
            <Skeleton className="h-4 w-96" variant="text" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>

        {/* Main Body Skeleton */}
        <div className="flex flex-1 gap-6 min-h-0 lg:flex-row overflow-hidden mb-6">
          {/* Sidebar Context Skeleton */}
          <div className="hidden lg:flex lg:w-72 xl:w-80 shrink-0">
            <Skeleton className="h-full w-full rounded-[2.5rem] md:rounded-[3rem]" />
          </div>

          {/* Chat Skeleton */}
          <div className="flex flex-1 flex-col gap-6">
            <Skeleton className="h-20 w-full rounded-[2rem]" />
            <div className="flex-1 flex flex-col gap-4">
              <Skeleton className="h-32 w-2/3 rounded-3xl" />
              <div className="flex justify-end">
                <Skeleton className="h-24 w-2/3 rounded-3xl" />
              </div>
              <Skeleton className="h-40 w-full rounded-3xl" />
            </div>
            <Skeleton className="h-16 w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
