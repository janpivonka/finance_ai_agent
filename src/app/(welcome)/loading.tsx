import React from "react";
import { Skeleton } from "../components/ui/Skeleton";
import { PageBackground } from "../components/ui/PageBackground";

export default function WelcomeLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[600px] h-[600px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-cyan-600", size: "w-[700px] h-[700px]", opacity: "opacity-10", animate: true, delay: "2s" }
        ]}
        withNoise
      />

      {/* Header Skeleton */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="hidden md:block h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-12">
        <div className="flex flex-col items-center">
          <Skeleton className="h-8 w-64 rounded-full mb-8" />
          <Skeleton className="h-16 md:h-24 w-full max-w-3xl rounded-2xl mb-4" />
          <Skeleton className="h-16 md:h-24 w-2/3 rounded-2xl mb-8" />
          <Skeleton className="h-6 w-full max-w-xl rounded-lg mb-12" />

          <div className="flex flex-col md:flex-row items-center gap-6 justify-center w-full">
            <Skeleton className="h-16 w-48 rounded-2xl" />
            <Skeleton className="h-16 w-48 rounded-2xl" />
          </div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 bg-[var(--panel)] border border-[color:var(--panel-border)] rounded-[2.5rem]">
              <Skeleton className="w-14 h-14 rounded-2xl mb-6" />
              <Skeleton className="h-6 w-32 rounded-lg mb-3" />
              <Skeleton className="h-4 w-full rounded-md mb-2" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
