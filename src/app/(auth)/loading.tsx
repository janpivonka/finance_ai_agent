import React from "react";
import { Skeleton } from "../components/ui/Skeleton";
import { PageBackground } from "../components/ui/PageBackground";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col items-center justify-center p-6">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-cyan-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true }
        ]}
        withNoise
      />

      {/* Header Buttons Skeleton */}
      <div className="absolute top-8 left-8 z-20">
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
      <div className="absolute top-8 right-8 z-20">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>

      {/* Auth Card Skeleton */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[var(--panel)] border border-[color:var(--panel-border)] rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
            <Skeleton className="h-8 w-48 rounded-lg mb-2" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>

          {/* Social Login Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>

          {/* Form Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded ml-4" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded ml-4" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-14 w-full rounded-2xl mt-4" />
          </div>

          <div className="mt-10 flex justify-center">
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
