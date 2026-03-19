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
    indigo: "bg-indigo-950/40 text-indigo-400 ring-indigo-500/30",
    fuchsia: "bg-fuchsia-950/40 text-fuchsia-400 ring-fuchsia-500/30",
    cyan: "bg-cyan-950/40 text-cyan-400 ring-cyan-500/30",
    rose: "bg-rose-950/40 text-rose-400 ring-rose-500/30",
    emerald: "bg-emerald-950/40 text-emerald-400 ring-emerald-500/30",
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ring-1 backdrop-blur-md ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} className={animate ? "animate-pulse" : ""} />}
      {text}
    </div>
  );
};
