import React from "react";
import { Zap } from "lucide-react";

export const DashboardHeader = () => (
  <header className="mb-12 relative text-left reveal">
    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-6 shadow-xl ring-1 ring-indigo-500/30 backdrop-blur-md">
      <Zap size={12} className="text-cyan-400 animate-pulse" />
      Neural Financial Ecosystem 2.0
    </div>
    <h1 className="mb-6 overflow-visible text-5xl font-black leading-[1.05] tracking-tighter text-white md:text-7xl">
      Vítejte,{" "}
      <span className="inline-block align-baseline pb-1 pr-1 animate-gradient-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-[length:200%_auto] bg-clip-text text-transparent">
        Peony
      </span>
    </h1>
    <p className="text-lg text-slate-400 max-w-2xl leading-relaxed font-medium border-l-2 border-indigo-500/30 pl-6">
      Váš inteligentní kokpit je online. Synchronizovali jsme data z trhu a připravili analýzu vašich aktiv.
    </p>
  </header>
);
