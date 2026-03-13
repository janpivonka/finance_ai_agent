"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  Home, 
  Mic, 
  FolderOpen, 
  TrendingUp,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Coins,
  Lock,
  Zap,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("finance_history") || "[]");
    if (saved.length > 0) {
      setLastAnalysis(saved[0]);
    }
    setIsLoaded(true);
  }, []);

  const goToConsultation = () => {
    if (lastAnalysis) {
      router.push(`/consultation?uspora=${lastAnalysis.uspora}&fixace=${lastAnalysis.fixace}`);
    } else {
      router.push('/analysis');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] px-6 pt-16 pb-24 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* BACKGROUND ARCHITECTURE */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      <div className={`mx-auto max-w-6xl relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* HEADER SEKCE */}
        <header className="mb-12 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-6 shadow-xl ring-1 ring-indigo-500/30 backdrop-blur-md">
            <Zap size={12} className="text-cyan-400 animate-pulse" />
            Neural Financial Ecosystem 2.0
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl mb-6">
            Vítejte, <span className="animate-gradient-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-[length:200%_auto] bg-clip-text text-transparent">Peony</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed font-medium border-l-2 border-indigo-500/30 pl-6">
            Váš inteligentní kokpit je online. Synchronizovali jsme data z trhu a připravili analýzu vašich aktiv.
          </p>
        </header>

        {/* HLAVNÍ AKČNÍ KARTY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Analýza Hypotéky */}
          <div 
            onClick={() => router.push('/analysis')}
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 transition-all hover:bg-slate-900/60 hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(79,70,229,0.2)]"
          >
            <div className="absolute -right-4 -top-4 text-indigo-500/5 rotate-12 group-hover:text-indigo-500/10 transition-colors">
              <Home size={120} />
            </div>
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                <Home size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analýza hypotéky</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">Odhalte skryté poplatky a prostor pro úsporu ve vaší smlouvě.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-500/20">Active Scan</span>
                <ArrowRight size={18} className="text-slate-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>

          {/* Hlasová konzultace */}
          <div 
            onClick={goToConsultation}
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 transition-all hover:bg-slate-900/60 hover:border-emerald-500/50 hover:shadow-[0_0_40_rgba(16,185,129,0.2)]"
          >
            <div className="absolute -right-4 -top-4 text-emerald-500/5 rotate-12 group-hover:text-emerald-500/10 transition-colors">
              <Mic size={120} />
            </div>
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                <Mic size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hlasový AI Bankéř</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">Proberte výsledky analýzy přirozeně hlasem v reálném čase.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20">Live Connection</span>
                <ArrowRight size={18} className="text-slate-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>

          {/* Moje Historie */}
          <div 
            onClick={() => router.push('/history')}
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 transition-all hover:bg-slate-900/60 hover:border-fuchsia-500/50 hover:shadow-[0_0_40px_rgba(217,70,219,0.2)]"
          >
            <div className="absolute -right-4 -top-4 text-fuchsia-500/5 rotate-12 group-hover:text-fuchsia-500/10 transition-colors">
              <FolderOpen size={120} />
            </div>
            <div className="relative z-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 ring-1 ring-fuchsia-500/20 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-500">
                <FolderOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Moje historie</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">Kompletní archiv vašich dokumentů a vygenerovaných reportů.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-fuchsia-400 bg-fuchsia-500/10 ring-1 ring-fuchsia-500/20">Cloud Archive</span>
                <ArrowRight size={18} className="text-slate-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMICKÝ BANNER: MAIN INSIGHT */}
        <div className="rounded-[3.5rem] bg-gradient-to-br from-slate-900 to-[#020617] p-10 text-white relative overflow-hidden shadow-2xl ring-1 ring-white/10 mb-12 group">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="flex-1">
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
                  <span className="text-7xl font-black tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-slate-400 bg-clip-text text-transparent italic">
                    {lastAnalysis ? `${Number(lastAnalysis.uspora).toLocaleString()} Kč` : "0 Kč"}
                  </span>
                  <span className="text-slate-500 text-2xl font-light">/ měsíčně</span>
                </div>
                
                {lastAnalysis && (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] max-w-2xl backdrop-blur-md group-hover:border-indigo-500/30 transition-all duration-500">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "Vaše současná sazba je o <span className="text-fuchsia-400 font-bold">1.2%</span> nad tržním průměrem. Refinancováním ušetříte celkem <span className="text-cyan-400 font-bold">{(lastAnalysis.uspora * 12 * 5).toLocaleString()} Kč</span> během příštích 5 let."
                    </p>
                  </div>
                )}
              </div>

              {lastAnalysis && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {lastAnalysis.top_nabidky?.slice(0, 3).map((offer: any, i: number) => (
                    <div key={i} className="group/card relative rounded-2xl bg-white/5 p-5 border border-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-cyan-500/50">
                      <div className="flex items-center gap-2 text-indigo-400 mb-2">
                        <Building2 size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{offer.banka}</span>
                      </div>
                      <div className="text-2xl font-black text-white">{offer.sazba}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Úspora {Number(offer.usp).toLocaleString()} Kč</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-4 min-w-[300px]">
              <button 
                onClick={goToConsultation}
                className="group relative flex items-center justify-center gap-4 bg-white text-slate-950 px-8 py-6 rounded-[2rem] font-black text-lg transition-all hover:bg-cyan-400 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                <TrendingUp size={20} className="group-hover:rotate-12 transition-transform" />
                {lastAnalysis ? "Získat tuto úsporu" : "Spustit analýzu"}
              </button>
              
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Security</p>
                  <div className="text-indigo-400 text-[10px] font-black uppercase">AES-256</div>
                </div>
              </div>
            </div>
          </div>

          {/* BACKGROUND ELEMENTS */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-all duration-1000" />
        </div>

        {/* SEKCE: BUDOUCÍ MODULY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="relative group overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/40 p-10 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-500/30">
             <div className="absolute top-6 right-8 bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-3 py-1 rounded-full ring-1 ring-indigo-500/30 uppercase tracking-widest">
               Soon
             </div>
             <div className="mb-6 h-20 w-20 rounded-[2rem] bg-slate-800/50 flex items-center justify-center ring-1 ring-white/5 group-hover:bg-indigo-500/10 group-hover:ring-indigo-500/30 transition-all duration-500">
                <ShieldCheck size={40} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
             </div>
             <h3 className="text-xl font-bold text-slate-300 mb-2">Pojištění 2.0</h3>
             <p className="text-sm text-slate-500 max-w-xs leading-relaxed font-medium">
               Automatické hlídání podpojištění a optimalizace pojistného krytí pomocí AI.
             </p>
          </div>

          <div className="relative group overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/40 p-10 flex flex-col items-center justify-center text-center transition-all hover:border-fuchsia-500/30">
             <div className="absolute top-6 right-8 bg-fuchsia-500/10 text-fuchsia-400 text-[9px] font-black px-3 py-1 rounded-full ring-1 ring-fuchsia-500/30 uppercase tracking-widest">
               Soon
             </div>
             <div className="mb-6 h-20 w-20 rounded-[2rem] bg-slate-800/50 flex items-center justify-center ring-1 ring-white/5 group-hover:bg-fuchsia-500/10 group-hover:ring-fuchsia-500/30 transition-all duration-500">
                <Coins size={40} className="text-slate-600 group-hover:text-fuchsia-400 transition-colors" />
             </div>
             <h3 className="text-xl font-bold text-slate-300 mb-2">Wealth Management</h3>
             <p className="text-sm text-slate-500 max-w-xs leading-relaxed font-medium">
               Sledujte své investice, kryptoměny a majetek v jednom inteligentním feedu.
             </p>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          animation: gradient-text 6s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}