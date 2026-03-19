import React from "react";
import { LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  highlight: string;
  description: string;
  badge?: string;
  icon: LucideIcon;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  title, 
  highlight, 
  description, 
  badge, 
  icon: Icon 
}) => {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-white/5 bg-slate-900/40 p-7 shadow-xl transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2 hover:border-indigo-500/30">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#020617] ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-inner group-hover:bg-indigo-600/20">
          <Icon size={20} className="text-indigo-400 group-hover:text-cyan-400 transition-colors group-hover:scale-110 duration-300" />
        </div>
        {badge && (
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-300 ring-1 ring-indigo-500/30 text-right group-hover:bg-indigo-500/20 transition-colors">
            {badge}
          </span>
        )}
      </div>
      <div className="text-left">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{title}</h3>
        <p className="text-2xl font-black text-white mb-2 leading-tight tracking-tight group-hover:text-cyan-400 transition-colors">{highlight || "Nenalezeno"}</p>
        <p className="text-[11px] leading-relaxed text-slate-500 font-medium">{description}</p>
      </div>
    </article>
  );
};
