"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { analyzeContract } from "./actions";
import { 
  FileText, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  UploadCloud, 
  Activity,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Wallet,
  Mail,
  History
} from "lucide-react";
import { ScrollToTop } from "../components/ScrollToTop";

// --- IMPORT TVÝCH HOOKŮ ---
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useScrollDirection } from "../hooks/useScrollDirection";

// --- POMOCNÉ KOMPONENTY ---

function SavingsChart({ currentUspora, totalUspora, banka, puvodniSplatka }: { currentUspora: number, totalUspora: number, banka: string, puvodniSplatka?: number }) {
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
                <span className="text-xl font-black text-fuchsia-500">+{animatedFiveYearsSavings.toLocaleString()} Kč</span>
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
}

function RecommendationCard({ title, highlight, description, badge, icon: Icon }: any) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-white/5 bg-slate-900/40 p-7 shadow-xl transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2 hover:border-indigo-500/30">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#020617] ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-inner group-hover:bg-indigo-600/20">
          <Icon size={20} className="text-indigo-400 group-hover:text-cyan-400 transition-colors group-hover:scale-110 duration-300" />
        </div>
        {badge && (
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-300 ring-1 ring-indigo-500/30 text-right group-hover:bg-indigo-500/20 transition-colors">
            {badge}
          </span>
        )}
      </div>
      <div className="text-left">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{title}</h3>
        <p className="text-2xl font-black text-white mb-2 leading-tight tracking-tight group-hover:text-cyan-400 transition-colors">{highlight || "Nenalezeno"}</p>
        <p className="text-[11px] leading-relaxed text-slate-500 font-medium">{description}</p>
      </div>
    </article>
  );
}

// --- HLAVNÍ STRÁNKA ---

export default function AnalysisPage() {
  const router = useRouter();
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [displayUspora, setDisplayUspora] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useScrollDirection();
  useIntersectionObserver(analysis ? '.reveal' : '.nothing');

  // --- HOOK PRO NAČTENÍ Z HISTORIE ---
  useEffect(() => {
    setMounted(true);
    
    const savedData = localStorage.getItem("analysis_entry_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAnalysis(parsed);
        setUploadedFileName(parsed.fileName || "Záznam z historie");
        
        // Vyčistit data, aby se nenačítala při refreshu
        localStorage.removeItem("analysis_entry_data");
        
        // Scroll na začátek výsledků
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        console.error("Chyba při parsování dat z historie:", e);
      }
    }
  }, []);

  const loadingMessages = [
    "Identifikuji strukturu dokumentu...",
    "Provádím screening bankovního trhu...",
    "Počítám finanční metriky a ROI...",
    "Generuji finální analytický report..."
  ];

  const currentStage = Math.min(Math.floor(loadingProgress / 25), 3);

  useEffect(() => {
    if (analysis && analysis.uspora) {
      const target = Number(analysis.uspora) || 0;
      const startValue = 0; 
      const duration = 2000; 
      const frameRate = 1000 / 60;
      const totalFrames = duration / frameRate;
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setDisplayUspora(startValue + (target - startValue) * easeOutExpo);

        if (frame >= totalFrames) {
          setDisplayUspora(target);
          clearInterval(timer);
        }
      }, frameRate);

      return () => clearInterval(timer);
    }
  }, [analysis]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 30) return prev + 0.8; 
          if (prev < 70) return prev + 0.4;
          if (prev < 90) return prev + 0.2;
          if (prev < 98) return prev + 0.05;
          return prev;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleProcess = async (formData: FormData, fileName: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setDisplayUspora(0);
    setUploadedFileName(fileName);
    
    try {
      const result: any = await analyzeContract(formData);
      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result) {
        setLoadingProgress(100);
        setTimeout(() => {
          // Obohatíme výsledek o název souboru a datum pro historii
          const resultWithMeta = { 
            ...result, 
            fileName: fileName,
            id: `anl-${Date.now()}`,
            date: new Date().toLocaleDateString('cs-CZ') 
          };
          
          setAnalysis(resultWithMeta);
          setLoading(false);
          
          const history = JSON.parse(localStorage.getItem("finance_history") || "[]");
          localStorage.setItem("finance_history", JSON.stringify([resultWithMeta, ...history.slice(0, 9)]));
        }, 600);
      }
    } catch (err) {
      setError("Nepodařilo se spojit s analytickou AI.");
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setContractText("");
    setUploadedFileName(null);
    setDisplayUspora(0);
    setLoadingProgress(0);
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-200 transition-all duration-1000 ${!analysis ? "h-screen overflow-hidden" : ""}`}>
      <div className="mx-auto max-w-6xl px-8 h-full flex flex-col relative py-8 md:px-12">
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* HEADER */}
        <header className="mb-6 relative z-10 shrink-0 reveal-header flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
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
              onClick={resetAnalysis}
              className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-pointer"
            >
              <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
              Další instrument
            </button>
          )}
        </header>

        <div className={`relative z-10 flex-1 flex flex-col gap-4 transition-all duration-700 ${!analysis ? "justify-center" : ""}`}>
          
          {!analysis && !loading && (
            <section className="reveal-init rounded-[3.5rem] border border-white/5 bg-slate-900/60 backdrop-blur-2xl p-2 md:p-3 shadow-2xl ring-1 ring-white/10 transition-all duration-500 max-w-5xl mx-auto w-full group/main">
              <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr] items-center bg-slate-950/50 rounded-[3.2rem] p-6 md:p-8">
                <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/5 p-8 transition-all duration-500 hover:border-cyan-500/50 hover:bg-cyan-500/5 overflow-hidden min-h-[220px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-cyan-500 group-hover:shadow-cyan-500/40">
                    <UploadCloud size={28} className="group-hover:animate-bounce" />
                  </div>
                  <div className="relative text-center">
                    <p className="text-sm font-black text-white tracking-widest uppercase mb-1">
                      Nahrát PDF smlouvu
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">Neural OCR Scan</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const fd = new FormData(); fd.append("file", f);
                      handleProcess(fd, f.name);
                    }
                  }} />
                </label>

                <div className="flex md:flex-col items-center gap-4 py-2 md:py-0">
                  <div className="h-px md:h-20 w-full md:w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter border border-white/5 rounded-full p-2 bg-slate-900 shadow-xl">NEBO</span>
                  <div className="h-px md:h-20 w-full md:w-px bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                </div>

                <div className="flex flex-col gap-4 h-full text-left">
                  <div className="relative group/input flex-1">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2rem] opacity-0 group-focus-within/input:opacity-20 transition duration-500 blur" />
                    <textarea
                      placeholder="Vložte text smlouvy pro rychlý screening..."
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      className="relative w-full h-[180px] md:h-full rounded-[1.8rem] border border-white/5 bg-slate-950/80 p-6 text-sm text-indigo-100 outline-none focus:ring-1 focus:ring-white/20 resize-none font-medium transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const fd = new FormData(); fd.append("text", contractText);
                      handleProcess(fd, "Manuální vstup textu");
                    }}
                    disabled={loading || !contractText.trim()}
                    className="group relative overflow-hidden rounded-[1.5rem] bg-white px-8 py-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-10 shadow-2xl cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#020617] group-hover:text-white transition-colors">
                      Spustit Audit <Zap size={14} className="fill-current" />
                    </span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center max-w-md mx-auto">
              <div className="relative mb-12">
                <div className="h-32 w-32 rounded-[2.5rem] border-[3px] border-white/5 border-t-cyan-400 animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-pulse" size={40} />
              </div>
              
              <div className="w-full space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">AI Analysis Progress</span>
                    <span className="text-xs font-black text-cyan-400 tracking-tighter">{Math.round(loadingProgress)}%</span>
                  </div>
                  <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight h-8 flex items-center justify-center transition-all duration-500">
                    {loadingMessages[currentStage]}
                  </h3>
                  <p className="text-[9px] text-slate-600 uppercase tracking-[0.5em] font-bold animate-pulse">Neural Core Processing</p>
                </div>
              </div>
            </div>
          )}

          {analysis && !loading && (
            <section className="pb-20 space-y-12">
              <div className="reveal mb-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <div className="reveal mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="text-left">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2 animate-pulse">Audit Report Complete</h2>
                  <h3 className="text-4xl font-black text-white tracking-tight text-left">Analytický výstup</h3>
                  
                  <div className="mt-6 space-y-3">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 shadow-sm animate-fade-in">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20">
                        <FileText size={12} className="text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zdroj:</span>
                      <span className="text-[11px] font-black text-white truncate max-w-[250px] md:max-w-md">
                        {uploadedFileName || "Manuální vstup dat"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <Mail size={12} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Odesláno na email</span>
                      </div>

                      <button 
                        onClick={() => {
                          try {
                            if (analysis?.id) {
                              localStorage.setItem(
                                "last_analysis_data",
                                JSON.stringify({ id: analysis.id }),
                              );
                            }
                          } catch (e) {
                            console.error(
                              "Nepodařilo se uložit last_analysis_data pro historii:",
                              e,
                            );
                          }
                          router.push("/history");
                        }}
                        className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer group/badge animate-fade-in"
                        style={{ animationDelay: '0.2s' }}
                      >
                        <History size={12} className="text-indigo-300 group-hover/badge:rotate-[-45deg] transition-transform" />
                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-wider">Dostupné v historii</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const idParam = encodeURIComponent(String(analysis.id || ""));
                    const usporaParam = encodeURIComponent(String(analysis.uspora));
                    const fixaceParam = encodeURIComponent(String(analysis.fixace));
                    router.push(`/consultation?id=${idParam}&uspora=${usporaParam}&fixace=${fixaceParam}`);
                  }}
                  className="group flex items-center justify-center gap-4 rounded-2xl bg-indigo-600 px-10 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95 cursor-pointer"
                >
                  Personalizovaná konzultace
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </button>
              </div>

              <div className="reveal">
                <SavingsChart 
                  currentUspora={displayUspora} 
                  totalUspora={Number(analysis.uspora) || 0}
                  banka={analysis.top_nabidky?.[0]?.banka || "Tržní průměr"} 
                  puvodniSplatka={Number(analysis.aktualni_splatka) || undefined}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3 mb-12">
                <div className="reveal"><RecommendationCard icon={FileText} title="Termín Fixace" highlight={analysis.fixace} description="Otevřené okno pro bezpoplatkový transfer." badge="Datum" /></div>
                <div className="reveal">
                  <RecommendationCard 
                    icon={Wallet} 
                    title="Měsíční cashflow" 
                    highlight={`+${Math.floor(displayUspora).toLocaleString()} Kč`} 
                    description="Čistá úspora uvolněná do vašeho rozpočtu." 
                    badge="Výnos" 
                  />
                </div>
                <div className="reveal"><RecommendationCard icon={ShieldCheck} title="Rating pojistky" highlight={analysis.pojisteni} description="Analýza rizikového krytí vůči jistině." badge="Bezpečí" /></div>
              </div>

              <div className="reveal overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 group transition-all duration-500 hover:border-indigo-500/20">
                  <div className="px-10 py-7 bg-white/5 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-black text-white tracking-widest uppercase text-xs">Benchmark Top nabídek</h3>
                      <div className="flex items-center gap-2 text-[9px] font-black text-cyan-400 uppercase bg-cyan-400/10 px-4 py-1.5 rounded-full ring-1 ring-cyan-500/20 animate-pulse">
                        <CheckCircle2 size={12}/> Market Verified
                      </div>
                  </div>
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-sm">
                      <thead className="bg-[#020617]/30 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <tr>
                          <th className="px-10 py-6 text-left">Instituce</th>
                          <th className="px-10 py-6 text-left">Sazba</th>
                          <th className="px-10 py-6 text-left text-cyan-400">Měsíční úspora</th>
                          <th className="px-10 py-6 text-left hidden md:table-cell">Strategická výhoda</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {analysis.top_nabidky?.map((item: any, i: number) => {
                          const localUspora = Number(item?.usp || 0);
                          return (
                            <tr key={i} className="group/row hover:bg-indigo-500/5 transition-all duration-300 text-left">
                              <td className="px-10 py-7 font-black text-white group-hover/row:text-cyan-400 transition-colors">{item?.banka || "—"}</td>
                              <td className="px-10 py-7 font-bold text-slate-400">{item?.sazba || "—"}</td>
                              <td className="px-10 py-7 font-black text-cyan-400 text-xl group-hover/row:scale-105 transition-transform origin-left">
                                 +{Math.floor(localUspora * (displayUspora / (Number(analysis.uspora) || 1))).toLocaleString()} Kč
                              </td>
                              <td className="px-10 py-7 hidden md:table-cell">
                                <span className="rounded-xl bg-[#020617] border border-white/5 px-4 py-2 text-[10px] font-black text-slate-500 group-hover/row:text-indigo-400 group-hover/row:border-indigo-500/30 transition-all uppercase tracking-widest">
                                  {item?.vyhoda || "Standardní podmínky"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-10 bg-white/5 border-t border-white/5 text-left">
                    <div className="flex gap-5 p-7 bg-[#020617]/60 rounded-3xl border border-white/5 shadow-inner">
                        <TrendingUp className="text-indigo-500 shrink-0" size={24} />
                        <div className="text-xs text-slate-400 leading-relaxed italic font-medium">
                          <span className="text-white font-bold not-italic uppercase text-[10px] block mb-1">Strategické doporučení AI:</span>
                          {analysis.kreativni_vypocet || analysis.analyticky_duvod || "Vaše úspora je připravena k uvolnění."}
                        </div>
                    </div>
                  </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <ScrollToTop />
      <style jsx global>{`
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulse-gentle { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.01); opacity: 0.98; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.05); } }
        @keyframes reveal-css { from { opacity: 0; transform: translateY(20px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        
        .reveal-header { animation: reveal-css 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-init { animation: reveal-css 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        
        .animate-gradient-text { animation: gradient-text 5s ease infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        
        ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
      `}</style>
    </div>
  );
}
