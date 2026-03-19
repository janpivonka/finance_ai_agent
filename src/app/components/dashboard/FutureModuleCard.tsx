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
  <div className={`relative group cursor-not-allowed overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/40 p-10 flex flex-col items-center justify-center text-center transition-all opacity-60 hover:opacity-100 ${colorClass}`}>
    <div className={`absolute top-6 right-8 bg-white/10 text-white text-[9px] font-black px-3 py-1 rounded-full ring-1 ring-white/30 uppercase tracking-widest`}>
      Soon
    </div>
    <div className="mb-6 h-20 w-20 rounded-[2rem] bg-slate-800/50 flex items-center justify-center ring-1 ring-white/5 group-hover:bg-white/10 group-hover:ring-white/30 transition-all duration-500">
       <Icon size={40} className="text-slate-600 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-slate-300 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 max-w-xs leading-relaxed font-medium">
      {description}
    </p>
  </div>
);
