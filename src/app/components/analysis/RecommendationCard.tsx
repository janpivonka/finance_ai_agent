import React from "react";
import { LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  highlight: string;
  description: string;
  badge?: string;
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  title, 
  highlight, 
  description, 
  badge, 
  icon: Icon,
  onClick,
  isActive = false
}) => {
  return (
    <article 
      onClick={onClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-[color:var(--card-border)] bg-[var(--card-bg)] p-7 shadow-xl transition-all duration-500 hover:bg-[var(--card-hover-bg)] hover:-translate-y-2 hover:border-indigo-500/30 cursor-pointer ${isActive ? 'bg-[var(--card-hover-bg)] -translate-y-2 border-indigo-500/30 scale-[0.98]' : ''}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background)] ring-1 ring-[color:var(--panel-border)] group-hover:ring-cyan-500/50 transition-all shadow-inner group-hover:bg-indigo-600/20 ${isActive ? 'ring-cyan-500/50 bg-indigo-600/20' : ''}`}>
          <Icon size={20} className={`text-indigo-400 group-hover:text-cyan-400 transition-colors group-hover:scale-110 duration-300 ${isActive ? 'text-cyan-400 scale-110' : ''}`} />
        </div>
        {badge && (
          <span className={`rounded-full bg-indigo-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-300 ring-1 ring-indigo-500/30 text-right group-hover:bg-indigo-500/20 transition-colors ${isActive ? 'bg-indigo-500/20' : ''}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-left">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--muted-2)] mb-2">{title}</h3>
        <p className={`text-2xl font-black text-[color:var(--foreground)] mb-2 leading-tight tracking-tight group-hover:text-cyan-500 transition-colors ${isActive ? 'text-cyan-500' : ''}`}>{highlight || "Nenalezeno"}</p>
        <p className="text-[11px] leading-relaxed text-[color:var(--muted)] font-medium">{description}</p>
      </div>
    </article>
  );
};
