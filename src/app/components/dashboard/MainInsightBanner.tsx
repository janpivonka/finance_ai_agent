import React from "react";
import { Activity, Building2, TrendingUp } from "lucide-react";
import { HistoryItem } from "@/types";

interface MainInsightBannerProps {
  lastAnalysis: HistoryItem | null;
  onAction: () => void;
}

export const MainInsightBanner: React.FC<MainInsightBannerProps> = ({ 
  lastAnalysis, 
  onAction 
}) => (
  <div className="rounded-[3.5rem] bg-gradient-to-br from-[var(--panel-strong)] to-[var(--background)] p-10 text-[color:var(--foreground)] relative overflow-hidden shadow-2xl ring-1 ring-[color:var(--panel-border-strong)] mb-12 group reveal transition-all duration-700">
    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
      <div className="flex-1 text-left">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40">
            <Activity size={16} className="animate-pulse" />
          </div>
          <h2 className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px]">
            {lastAnalysis ? "AI Detekce: Masivní příležitost" : "Systém: Připraven k analýze"}
          </h2>
        </div>
        
        <div className="space-y-4 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
            <span className="text-7xl font-black tracking-tighter bg-gradient-to-r from-[color:var(--foreground)] via-indigo-400 to-slate-400 bg-clip-text text-transparent italic">
              {lastAnalysis ? `${Number(lastAnalysis.uspora).toLocaleString()} Kč` : "0 Kč"}
            </span>
            <span className="text-[color:var(--muted)] text-2xl font-light">/ měsíčně</span>
          </div>
          
          {lastAnalysis && (
            <div className="p-6 bg-[var(--panel)] border border-[color:var(--panel-border)] rounded-[2rem] max-w-2xl backdrop-blur-md group-hover:border-indigo-500/30 transition-all duration-500">
              <p className="text-[color:var(--muted)] text-sm leading-relaxed">
                Vaše současná sazba je o{" "}
                <span className="text-fuchsia-400 font-bold">1.2%</span> nad tržním
                průměrem. Refinancováním ušetříte celkem{" "}
                <span className="text-cyan-400 font-bold">
                  {(lastAnalysis.uspora * 12 * 5).toLocaleString()} Kč
                </span>{" "}
                během příštích 5 let.
              </p>
            </div>
          )}
        </div>

        {lastAnalysis && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lastAnalysis.top_nabidky?.slice(0, 3).map((offer, i) => (
              <div key={i} className="group/card relative rounded-2xl bg-[var(--panel)] p-5 border border-[color:var(--panel-border)] backdrop-blur-sm transition-all hover:bg-[var(--panel-strong)] hover:border-cyan-500/50">
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <Building2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-left">{offer.banka}</span>
                </div>
                <div className="text-2xl font-black text-[color:var(--foreground)] text-left">{offer.sazba}</div>
                <div className="text-[10px] text-[color:var(--muted)] font-bold uppercase tracking-tight text-left">Úspora {Number(offer.usp).toLocaleString()} Kč</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-4 min-w-[300px]">
        <button 
          onClick={onAction}
          className="group relative cursor-pointer flex items-center justify-center gap-4 bg-[var(--button-primary-bg)] text-[color:var(--button-primary-text)] px-10 py-7 rounded-[2rem] font-black text-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[var(--button-primary-hover-bg)] hover:-rotate-3 hover:scale-110 active:scale-95 shadow-[0_15px_30px_rgba(34,211,238,0.2)] hover:shadow-[0_25px_60px_rgba(34,211,238,0.5)] border border-transparent hover:border-white/20"
        >
          <TrendingUp size={24} className="group-hover:translate-y-[-4px] group-hover:translate-x-[4px] transition-transform duration-500 ease-out" />
          {lastAnalysis ? "Získat tuto úsporu" : "Spustit analýzu"}
        </button>
        
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="text-center">
            <p className="text-[9px] text-[color:var(--muted)] uppercase font-black tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live
            </div>
          </div>
          <div className="h-8 w-px bg-[color:var(--panel-border)]" />
          <div className="text-center">
            <p className="text-[9px] text-[color:var(--muted)] uppercase font-black tracking-widest mb-1">Security</p>
            <div className="text-indigo-400 text-[10px] font-black uppercase">AES-256</div>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-all duration-1000" />
  </div>
);
