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
    className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 transition-all hover:bg-slate-900/60 ${className}`}
  >
    <div className="absolute -right-4 -top-4 text-white/5 rotate-12 group-hover:text-white/10 transition-colors">
      <Icon size={120} />
    </div>
    <div className="relative z-10 text-left">
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-all duration-500 ${iconBgClass}`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-8">{description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ring-1 ${badgeClass}`}>
          {badge}
        </span>
        <ArrowRight size={18} className={`text-slate-700 group-hover:translate-x-2 transition-all duration-300 ${arrowClass}`} />
      </div>
    </div>
  </div>
);
