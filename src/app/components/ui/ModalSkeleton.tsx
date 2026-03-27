import React from "react";
import { Skeleton } from "./Skeleton";

export const ModalSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-fade-in p-2">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48 rounded-lg" variant="text" />
          <Skeleton className="h-3 w-32 rounded-md" variant="text" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full rounded-[1.8rem]" />
        <Skeleton className="h-32 w-full rounded-[1.8rem]" />
        <Skeleton className="h-32 w-full rounded-[1.8rem]" />
        <Skeleton className="h-32 w-full rounded-[1.8rem]" />
      </div>

      {/* Bottom Large Box Skeleton */}
      <Skeleton className="h-40 w-full rounded-[2rem]" />

      {/* Footer Buttons Skeleton */}
      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-white/5">
        <Skeleton className="h-12 w-24 rounded-xl" />
        <div className="flex-1 flex gap-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};
