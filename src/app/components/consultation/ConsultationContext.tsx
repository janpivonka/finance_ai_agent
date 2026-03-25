import React from "react";
import { TrendingUp, Calendar, Headphones, Activity, PhoneCall, MicOff } from "lucide-react";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";

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
}) => {
  const { activeId, handleInteraction } = useMobileInteraction();

  return (
    <aside className="flex flex-col gap-6 w-full lg:w-72 xl:w-80 shrink-0 min-h-0 animate-fade-in-left h-full pb-4 overflow-hidden">
      <div className="flex-1 overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-[color:var(--panel-border)] bg-[var(--panel)] backdrop-blur-xl p-6 md:p-8 shadow-2xl flex flex-col min-h-0 ring-1 ring-[color:var(--panel-border)] group hover:border-indigo-500/20 transition-all text-left">
        <h2 className="mb-6 md:mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-[color:var(--muted-2)] shrink-0 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Analytický kontext
        </h2>
        
        <div className="flex-1 space-y-4 md:space-y-6 pr-1 scrollbar-hide pb-2 overflow-y-auto">
          <div 
            onClick={() => handleInteraction('ctx-uspora', () => {}, 0)}
            className={`group/item rounded-[2rem] bg-[var(--panel-strong)] dark:bg-[#020617]/60 p-5 md:p-7 transition-all duration-300 border border-[color:var(--panel-border)] hover:border-cyan-500/50 hover:ring-1 hover:ring-cyan-500/30 hover:bg-[var(--panel)] cursor-default bg-tint-cyan shadow-inner ${activeId === 'ctx-uspora' ? 'scale-95 border-cyan-500/50 ring-1 ring-cyan-500/30 bg-[var(--panel)]' : ''}`}
          >
            <div className="mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <TrendingUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Potenciál úspory</span>
            </div>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-4xl md:text-5xl font-black text-[color:var(--foreground)] tracking-tighter italic">{usporaParam}</span>
              <span className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase ml-1 md:ml-2 tracking-tighter">Kč/m</span>
            </div>
          </div>

          <div 
            onClick={() => handleInteraction('ctx-fixace', () => {}, 0)}
            className={`group/item rounded-[2rem] bg-[var(--panel-strong)] dark:bg-[#020617]/60 p-5 md:p-7 transition-all duration-300 border border-[color:var(--panel-border)] hover:border-indigo-500/50 hover:ring-1 hover:ring-indigo-500/30 hover:bg-[var(--panel)] cursor-default bg-tint-indigo shadow-inner ${activeId === 'ctx-fixace' ? 'scale-95 border-indigo-500/50 ring-1 ring-indigo-500/30 bg-[var(--panel)]' : ''}`}
          >
            <div className="mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Calendar size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Fixace do</span>
            </div>
            <span className="text-2xl md:text-3xl font-black text-[color:var(--foreground)] tracking-tight uppercase break-all md:break-normal">{fixaceParam}</span>
          </div>

          <div 
            onClick={() => handleInteraction('ctx-strategy', () => {}, 0)}
            className={`relative overflow-hidden rounded-[2rem] bg-[var(--panel-strong)] dark:bg-[#020617]/60 border border-fuchsia-500/25 p-5 md:p-7 shadow-xl ring-1 ring-fuchsia-500/20 bg-tint-pink transition-all duration-300 ${activeId === 'ctx-strategy' ? 'scale-95 border-fuchsia-500/50 bg-[var(--panel)]' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-indigo-500/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3 md:mb-4 text-fuchsia-600 dark:text-fuchsia-300">
                <Headphones size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Strategie</span>
              </div>
              <p className="text-[12px] md:text-[13px] leading-relaxed text-[color:var(--foreground-muted)] dark:text-slate-200 font-bold italic">
                „Na základě aktuální analýzy trhu doporučuji prověřit nabídky a podmínky u konkurenčních institucí.“
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 pt-2">
        {!isCalling ? (
          <button
            onClick={() => handleInteraction('start-call', onStart, 350)}
            disabled={starting}
            className={`group relative w-full overflow-hidden rounded-[2rem] bg-indigo-600 py-6 md:py-7 text-sm font-black text-white shadow-[0_15px_35px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:tracking-[0.2em] active:scale-95 disabled:opacity-50 uppercase tracking-widest cursor-pointer border border-indigo-400/30 ${activeId === 'start-call' ? 'bg-indigo-500 tracking-[0.2em] scale-95' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer ${activeId === 'start-call' ? 'animate-shimmer' : ''}`} />
            <div className="relative z-10 flex items-center justify-center gap-4">
              {starting ? <Activity size={24} className="animate-spin" /> : <><span>Zahájit uplink</span><PhoneCall size={20} className={`transition-transform duration-300 ${activeId === 'start-call' ? 'rotate-12' : 'group-hover:rotate-12'}`} /></>}
            </div>
          </button>
        ) : (
          <button
            onClick={() => handleInteraction('stop-call', onStop, 350)}
            className={`group w-full rounded-[2rem] bg-rose-500/10 py-6 md:py-7 font-black text-rose-600 dark:text-fuchsia-500 border border-rose-500/30 transition-all hover:bg-rose-500/20 active:scale-95 uppercase tracking-widest text-sm shadow-[0_10px_25px_rgba(244,63,94,0.1)] cursor-pointer ${activeId === 'stop-call' ? 'bg-rose-500/20 scale-95' : ''}`}
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
};
