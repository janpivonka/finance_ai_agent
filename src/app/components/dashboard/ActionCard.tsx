import React from "react";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ActionCardProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  className: string;
  iconBgClass: string;
  badgeClass: string;
  arrowClass: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({ 
  onClick, 
  icon: Icon, 
  title, 
  description, 
  badge, 
  className,
  iconBgClass,
  badgeClass,
  arrowClass
}) => (
  <div 
    onClick={onClick}
    className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-[color:var(--card-border)] bg-[var(--card-bg)] p-8 transition-all hover:bg-[var(--card-hover-bg)] hover:border-[color:var(--card-hover-border)] bg-tint-blue ${className}`}
  >
    <div className="absolute -right-4 -top-4 text-[color:var(--foreground)] opacity-[0.03] rotate-12 group-hover:opacity-[0.08] transition-opacity">
      <Icon size={120} />
    </div>
    <div className="relative z-10 text-left">
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-all duration-500 ${iconBgClass}`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-[color:var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm text-[color:var(--muted)] leading-relaxed mb-8">{description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ring-1 ${badgeClass}`}>
          {badge}
        </span>
        <ArrowRight size={18} className={`text-[color:var(--muted-2)] group-hover:translate-x-2 transition-all duration-300 ${arrowClass}`} />
      </div>
    </div>
  </div>
);
