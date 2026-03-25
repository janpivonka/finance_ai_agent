"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  variant = "rect" 
}) => {
  const baseClasses = "relative overflow-hidden bg-[var(--panel-strong)] opacity-50";
  const variantClasses = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-lg h-4 w-full"
  }[variant];

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};
