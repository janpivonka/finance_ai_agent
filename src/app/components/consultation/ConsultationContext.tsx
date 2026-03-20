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
  <aside className="flex flex-col gap-6 lg:w-72 xl:w-80 shrink-0 min-h-0 animate-fade-in-left h-full pb-4">
    <div className="flex-1 overflow-hidden rounded-[3rem] border border-[color:var(--panel-border)] bg-[var(--panel)] backdrop-blur-xl p-8 shadow-2xl flex flex-col min-h-0 ring-1 ring-[color:var(--panel-border)] group hover:border-indigo-500/20 transition-all text-left">
      <h2 className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-[color:var(--muted-2)] shrink-0 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
        Analytický kontext
      </h2>
      
      <div className="flex-1 space-y-6 pr-1 scrollbar-hide pb-2 overflow-y-auto">
        <div className="group/item rounded-[2rem] bg-[var(--panel-strong)] dark:bg-[#020617]/60 p-7 transition-all duration-300 border border-[color:var(--panel-border)] hover:border-cyan-500/50 hover:ring-1 hover:ring-cyan-500/30 hover:bg-[var(--panel)] cursor-default bg-tint-cyan shadow-inner">
          <div className="mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Potenciál úspory</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-[color:var(--foreground)] tracking-tighter italic">{usporaParam}</span>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase ml-2 tracking-tighter">Kč/m</span>
          </div>
        </div>

        <div className="group/item rounded-[2rem] bg-[var(--panel-strong)] dark:bg-[#020617]/60 p-7 transition-all duration-300 border border-[color:var(--panel-border)] hover:border-indigo-500/50 hover:ring-1 hover:ring-indigo-500/30 hover:bg-[var(--panel)] cursor-default bg-tint-indigo shadow-inner">
          <div className="mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Calendar size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Fixace do</span>
          </div>
          <span className="text-3xl font-black text-[color:var(--foreground)] tracking-tight uppercase">{fixaceParam}</span>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--panel-strong)] dark:bg-[#020617]/60 border border-fuchsia-500/25 p-7 shadow-xl ring-1 ring-fuchsia-500/20 bg-tint-pink">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-indigo-500/5 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4 text-fuchsia-600 dark:text-fuchsia-300">
              <Headphones size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Strategie</span>
            </div>
            <p className="text-[13px] leading-relaxed text-[color:var(--foreground-muted)] dark:text-slate-200 font-bold italic">
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
          className="group relative w-full overflow-hidden rounded-[2rem] bg-indigo-600 py-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:tracking-[0.2em] active:scale-95 disabled:opacity-50 uppercase tracking-widest cursor-pointer border border-indigo-400/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <div className="relative z-10 flex items-center justify-center gap-4">
            {starting ? <Activity size={24} className="animate-spin" /> : <><span>Zahájit uplink</span><PhoneCall size={20} className="group-hover:rotate-12 transition-transform duration-300" /></>}
          </div>
        </button>
      ) : (
        <button
          onClick={onStop}
          className="group w-full rounded-[2rem] bg-rose-500/10 py-7 font-black text-rose-600 dark:text-fuchsia-500 border border-rose-500/30 transition-all hover:bg-rose-500/20 active:scale-95 uppercase tracking-widest text-sm shadow-[0_10px_25px_rgba(244,63,94,0.1)] cursor-pointer"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            Ukončit spojení
          </div>
        </button>
      )}
    </div>
  </aside>
);
