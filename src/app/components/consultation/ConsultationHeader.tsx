import React from "react";
import { Zap, History, Search } from "lucide-react";

interface ConsultationHeaderProps {
  isCalling: boolean;
  onToHistory: () => void;
  onBackToAnalysis: () => void;
}

export const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({ 
  isCalling, 
  onToHistory, 
  onBackToAnalysis 
}) => (
  <header className="mb-6 flex shrink-0 items-start justify-between gap-4 relative z-10 animate-fade-in">
    <div className="min-w-0 flex-1 text-left">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400 ring-1 ring-indigo-500/30">
        <Zap size={12} className={`text-cyan-400 ${isCalling ? 'animate-bounce' : 'animate-pulse'}`} />
        Neural Consultation 2.0
      </div>
      <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-white md:text-5xl overflow-visible">
        AI{" "}
        <span className="inline-block align-baseline pb-1 pr-1 animate-gradient-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent italic">
          Bankovní
        </span>{" "}
        specialista
      </h1>
      
      <div className="mt-4 hidden md:flex gap-4 border-l border-indigo-500/50 pl-4 py-1">
        <p className="text-sm leading-relaxed text-slate-400 max-w-xl">
        Na základě vašich dat probereme možnosti optimalizace, poskytneme podrobnější informace vyplývající ze smlouvy a detaily související s vaším konkrétním produktem.
        </p>
      </div>
    </div>
    
    <div className="flex flex-col items-end gap-3">
      <div className="flex items-center gap-2">
        <button 
          onClick={onToHistory}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <History size={14} />
          <span className="hidden md:inline">Archiv</span>
        </button>
        <button 
          onClick={onBackToAnalysis}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
        >
          <Search size={14} />
          <span className="hidden md:inline">Analýza</span>
        </button>
      </div>

      <div className={`flex items-center gap-3 rounded-2xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-500 ring-1 ${
        isCalling ? 'bg-fuchsia-950/30 text-fuchsia-400 ring-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,219,0.3)]' : 'bg-slate-900/50 text-cyan-400 ring-cyan-500/30'
      }`}>
        <div className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isCalling ? 'animate-ping bg-fuchsia-400' : 'bg-cyan-400'}`}></span>
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isCalling ? 'bg-fuchsia-500' : 'bg-cyan-500'}`}></span>
        </div>
        <span className="hidden sm:inline">{isCalling ? "Live Uplink Active" : "Link Standby"}</span>
        <span className="sm:hidden">{isCalling ? "Live" : "Ready"}</span>
      </div>
    </div>
  </header>
);
