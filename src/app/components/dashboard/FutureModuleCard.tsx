import React from "react";
import { LucideIcon } from "lucide-react";

interface FutureModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
}

export const FutureModuleCard: React.FC<FutureModuleCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  colorClass 
}) => (
  <div className={`relative group cursor-not-allowed overflow-hidden rounded-[3rem] border border-[color:var(--card-border)] bg-[var(--card-bg)] p-10 flex flex-col items-center justify-center text-center transition-all opacity-60 hover:opacity-100 bg-tint-emerald ${colorClass}`}>
    <div className={`absolute top-6 right-8 bg-[var(--panel-strong)] text-[color:var(--foreground)] text-[9px] font-black px-3 py-1 rounded-full ring-1 ring-[color:var(--panel-border-strong)] uppercase tracking-widest`}>
      Soon
    </div>
    <div className="mb-6 h-20 w-20 rounded-[2rem] bg-[var(--panel)] flex items-center justify-center ring-1 ring-[color:var(--panel-border)] group-hover:bg-[var(--panel-strong)] group-hover:ring-[color:var(--panel-border-strong)] transition-all duration-500">
       <Icon size={40} className="text-[color:var(--muted-2)] group-hover:text-[color:var(--foreground)] transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-[color:var(--foreground)] mb-2 opacity-80">{title}</h3>
    <p className="text-sm text-[color:var(--muted)] max-w-xs leading-relaxed font-medium">
      {description}
    </p>
  </div>
);
