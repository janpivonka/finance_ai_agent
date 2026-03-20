import React from "react";
import { TrendingUp, Calendar, Headphones, Activity, PhoneCall, MicOff } from "lucide-react";

interface ConsultationContextProps {
  usporaParam: string;
  fixaceParam: string;
  isCalling: boolean;
  starting: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const ConsultationContext: React.FC<ConsultationContextProps> = ({ 
  usporaParam, 
  fixaceParam, 
  isCalling, 
  starting,
  onStart,
  onStop
}) => (
  <aside className="flex flex-col gap-4 lg:w-80 xl:w-96 shrink-0 min-h-0 animate-fade-in-left h-full">
    <div className="flex-1 overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl p-6 shadow-2xl flex flex-col min-h-0 ring-1 ring-white/5 group hover:border-indigo-500/20 transition-all text-left">
      <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shrink-0">
        Analytický kontext
      </h2>
      
      <div className="flex-1 space-y-4 pr-1 scrollbar-hide pb-2 overflow-y-auto">
        <div className="group/item rounded-[1.5rem] bg-[#020617]/60 p-6 transition-all duration-300 border border-white/5 hover:border-cyan-500/50 hover:ring-1 hover:ring-cyan-500/30 hover:bg-[#020617]/80 cursor-default">
          <div className="mb-2 flex items-center gap-2 text-cyan-400">
            <TrendingUp size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Potenciál úspory</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">{usporaParam}</span>
            <span className="text-xs font-bold text-slate-500 uppercase ml-1 text-indigo-400">Kč/m</span>
          </div>
        </div>

        <div className="group/item rounded-[1.5rem] bg-[#020617]/60 p-6 transition-all duration-300 border border-white/5 hover:border-indigo-500/50 hover:ring-1 hover:ring-indigo-500/30 hover:bg-[#020617]/80 cursor-default">
          <div className="mb-2 flex items-center gap-2 text-indigo-400">
            <Calendar size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Fixace do</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">{fixaceParam}</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#020617]/60 border border-fuchsia-500/25 p-5 shadow-[0_0_30px_rgba(217,70,219,0.12)] ring-1 ring-fuchsia-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/15 via-transparent to-indigo-500/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3 text-fuchsia-300">
              <Headphones size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">AI Strategie</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-200 font-semibold italic">
              „Na základě aktuální analýzy trhu doporučuji prověřit nabídky a podmínky u konkurenčních institucí.“
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="shrink-0 pt-2">
      {!isCalling ? (
        <button
          onClick={onStart}
          disabled={starting}
          className="group relative w-full overflow-hidden rounded-[1.5rem] bg-indigo-600 py-6 text-sm font-black text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:tracking-[0.2em] active:scale-95 disabled:opacity-50 uppercase tracking-widest cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <div className="relative z-10 flex items-center justify-center gap-3">
            {starting ? <Activity size={20} className="animate-spin" /> : <><span>Zahájit uplink</span><PhoneCall size={18} className="group-hover:rotate-12 transition-transform" /></>}
          </div>
        </button>
      ) : (
        <button
          onClick={onStop}
          className="group w-full rounded-[1.5rem] bg-fuchsia-950/20 py-6 font-black text-fuchsia-500 border border-fuchsia-500/40 transition-all hover:bg-fuchsia-500/10 active:scale-95 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(217,70,219,0.1)] cursor-pointer"
        >
          <div className="flex items-center justify-center gap-3">
            <MicOff size={18} className="animate-pulse" />
            Ukončit spojení
          </div>
        </button>
      )}
    </div>
  </aside>
);
