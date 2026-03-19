import React from "react";
import { Activity, RotateCcw } from "lucide-react";
import { AnalysisResult } from "@/types";

interface AnalysisHeaderProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  onReset: () => void;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ 
  analysis, 
  loading, 
  onReset 
}) => (
  <header className="mb-6 relative z-10 shrink-0 reveal-header flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="space-y-4 text-left">
      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ring-1 ring-indigo-500/30">
        <Activity size={12} className="text-cyan-400 animate-spin-slow" />
        AI Analytics Protocol v3
      </div>
      <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl animate-pulse-gentle overflow-visible">
        Analýza{" "}
        <span className="inline-block align-baseline pb-1 pr-1 animate-gradient-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent italic">
          Potenciálu
        </span>
      </h1>
      
      {!analysis && !loading && (
         <p className="text-lg text-slate-400 max-w-2xl leading-relaxed font-medium border-l-2 border-indigo-500/30 pl-6 animate-fade-in">
           Nahrajte dokument pro hloubkovou kontrolu skrytých poplatků a identifikaci úsporných příležitostí v reálném čase.
         </p>
      )}
    </div>

    {analysis && (
      <button 
        onClick={onReset}
        className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-pointer"
      >
        <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
        Další instrument
      </button>
    )}
  </header>
);
