import React from "react";
import { Activity } from "lucide-react";

interface SavingsChartProps {
  currentUspora: number;
  totalUspora: number;
  banka: string;
  puvodniSplatka?: number;
}

export const SavingsChart: React.FC<SavingsChartProps> = ({ 
  currentUspora, 
  totalUspora, 
  banka, 
  puvodniSplatka 
}) => {
  const animatedFiveYearsSavings = currentUspora * 12 * 5;
  const progressRatio = totalUspora > 0 ? (currentUspora / totalUspora) * 100 : 0;
  const novaSplatka = puvodniSplatka ? puvodniSplatka - currentUspora : null;

  return (
    <div className="mb-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5 ring-1 ring-white/5">
      <div className="absolute inset-0 opacity-5 pointer-events-none animate-pulse-slow" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 w-full text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 border border-indigo-500/20">
            <Activity size={12} className="text-cyan-400 animate-spin-slow" />
            Vizuální projekce nákladů
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-4 p-6 rounded-3xl bg-white/5 border border-white/5">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Aktuální splátka</span>
                <div className="text-xl font-bold text-slate-300 line-through decoration-fuchsia-500/50">
                  {puvodniSplatka ? `${puvodniSplatka.toLocaleString()} Kč` : "--- Kč"}
                </div>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-4">
                <span className="text-[9px] font-black uppercase text-cyan-500 tracking-wider">Nová splátka</span>
                <div className="text-2xl font-black text-white">
                  {novaSplatka ? `${Math.round(novaSplatka).toLocaleString()} Kč` : "Sníženo"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Kumulovaná úspora (5 let)</span>
                <span className="text-xl font-black text-fuchsia-500">+{Math.round(animatedFiveYearsSavings).toLocaleString()} Kč</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden ring-1 ring-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-600/20 to-fuchsia-500 shadow-[0_0_20px_rgba(217,70,219,0.3)] transition-all duration-75 ease-out" 
                  style={{ width: `${progressRatio}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase text-cyan-400 tracking-widest">Měsíční delta ({banka})</span>
                <span className="text-xl font-black text-cyan-400">
                  +{Math.round(currentUspora).toLocaleString()} Kč / měsíc
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden ring-1 ring-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600/20 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-75 ease-out" 
                  style={{ width: `${progressRatio}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-10 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20 backdrop-blur-2xl text-center min-w-[280px] shadow-inner group-hover:border-cyan-500/30 transition-colors duration-500">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Celkem ušetříte</div>
            <div className="text-6xl font-black text-white tracking-tighter mb-1 drop-shadow-2xl">
              {Math.floor(animatedFiveYearsSavings).toLocaleString()}
            </div>
            <div className="text-cyan-400 font-black text-[10px] uppercase tracking-widest mb-6 px-4 py-1.5 bg-cyan-500/10 rounded-full ring-1 ring-cyan-500/20 mt-2">Likvidní kapitál navíc</div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
            <p className="text-[10px] text-slate-500 italic leading-relaxed max-w-[200px]">Projekce úspory v pětiletém horizontu fixace.</p>
        </div>
      </div>
    </div>
  );
};
