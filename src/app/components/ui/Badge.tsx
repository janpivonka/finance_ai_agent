import React from "react";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
  icon?: LucideIcon;
  text: string;
  variant?: "indigo" | "fuchsia" | "cyan" | "rose" | "emerald";
  className?: string;
  animate?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  icon: Icon, 
  text, 
  variant = "indigo", 
  className = "",
  animate = false
}) => {
  const variants = {
    indigo: "bg-indigo-500/10 text-indigo-500 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-500/30",
    fuchsia: "bg-fuchsia-500/10 text-fuchsia-500 ring-fuchsia-500/20 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 dark:ring-fuchsia-500/30",
    cyan: "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20 dark:bg-cyan-950/40 dark:text-cyan-400 dark:ring-cyan-500/30",
    rose: "bg-rose-500/10 text-rose-500 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-500/30",
    emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/30",
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ring-1 backdrop-blur-md ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} className={animate ? "animate-pulse" : ""} />}
      {text}
    </div>
  );
};
