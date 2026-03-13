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
  AlertCircle
} from "lucide-react";

// --- POMOCNÉ KOMPONENTY ---

function SavingsChart({ uspora, banka }: { uspora: any, banka: string }) {
  const usporaNum = Number(uspora) || 0;
  const fiveYears = usporaNum * 12 * 5;

  return (
    <div className="mb-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5 ring-1 ring-white/5 animate-in fade-in zoom-in duration-700">
      <div className="absolute inset-0 opacity-5 pointer-events-none animate-pulse-slow" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 w-full text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 border border-indigo-500/20">
            <Activity size={12} className="text-cyan-400 animate-spin-slow" />
            Vizuální projekce nákladů
          </div>
          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Stávající přeplatek</span>
                <span className="text-xl font-black text-fuchsia-500">+{fiveYears.toLocaleString()} Kč</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden ring-1 ring-white/5">
                <div className="h-full w-full bg-gradient-to-r from-fuchsia-600/20 to-fuchsia-500 shadow-[0_0_20px_rgba(217,70,219,0.3)]" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-widest text-cyan-400">Optimalizovaný stav ({banka})</span>
                <span className="text-xl font-black text-cyan-400">0 Kč</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden ring-1 ring-white/5">
                <div className="h-full w-[12%] bg-gradient-to-r from-cyan-600/20 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-10 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20 backdrop-blur-2xl text-center min-w-[280px] shadow-inner group-hover:border-cyan-500/30 transition-colors duration-500">
           <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Identifikovaná úspora</div>
           <div className="text-6xl font-black text-white tracking-tighter mb-1 drop-shadow-2xl animate-pulse-gentle">{fiveYears.toLocaleString()}</div>
           <div className="text-cyan-400 font-black text-[10px] uppercase tracking-widest mb-6 px-4 py-1.5 bg-cyan-500/10 rounded-full ring-1 ring-cyan-500/20 mt-2">Likvidní kapitál navíc</div>
           <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
           <p className="text-[10px] text-slate-500 italic leading-relaxed max-w-[200px]">Výpočet v pětiletém horizontu při aktuální tržní predikci.</p>
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
  const [loadingStage, setLoadingStage] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // FIX: Prevence Hydration Error
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadingMessages = [
    "Identifikuji strukturu dokumentu...",
    "Provádím screening bankovního trhu...",
    "Počítám finanční metriky a ROI...",
    "Generuji finální analytický report..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleProcess = async (formData: FormData, fileName: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const result: any = await analyzeContract(formData);
      
      if (result && result.error) {
        setError(result.error);
      } else if (result) {
        setAnalysis(result);
        const history = JSON.parse(localStorage.getItem("finance_history") || "[]");
        localStorage.setItem("finance_history", JSON.stringify([result, ...history.slice(0, 9)]));
      }
    } catch (err) {
      console.error("Selhání analýzy:", err);
      setError("Nepodařilo se spojit s analytickým serverem.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-200 transition-all duration-1000 ${!analysis ? "h-screen overflow-hidden" : ""}`}>
      <div className="mx-auto max-w-6xl px-8 h-full flex flex-col relative py-12 md:px-12">
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <header className="mb-8 relative z-10 shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 ring-1 ring-indigo-500/30">
            <Activity size={12} className="text-cyan-400 animate-spin-slow" />
            AI Analytics Protocol
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl animate-pulse-gentle">
            Analýza <span className="animate-gradient-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent italic">Potenciálu</span>
          </h1>
        </header>

        <div className={`relative z-10 flex-1 flex flex-col gap-8 transition-all duration-700 ${!analysis ? "justify-center -mt-12" : ""}`}>
          
          <section className={`rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl ring-1 ring-white/5 transition-all duration-500 ${analysis ? "opacity-100 translate-y-0" : "max-w-4xl mx-auto w-full"}`}>
            <div className="grid gap-8 md:grid-cols-2 h-full">
              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/10 bg-[#020617]/40 p-10 transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 shadow-inner min-h-[250px]">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-cyan-500">
                  <UploadCloud size={28} className="group-hover:animate-bounce" />
                </div>
                <p className="text-xs font-black text-white tracking-wide uppercase text-center transition-colors group-hover:text-cyan-400">
                  {uploadedFileName || "Nahrát PDF smlouvu"}
                </p>
                <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest italic opacity-60">Neural OCR Processing</p>
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setUploadedFileName(f.name);
                    const fd = new FormData(); fd.append("file", f);
                    handleProcess(fd, f.name);
                  }
                }} />
              </label>

              <div className="flex flex-col gap-4">
                <textarea
                  placeholder="Vložte text pro rychlý screening..."
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  className="flex-1 min-h-[150px] rounded-[1.5rem] border border-white/5 bg-[#020617]/60 p-5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none font-medium shadow-inner transition-all hover:bg-[#020617]/80"
                />
                <button
                  onClick={() => {
                    const fd = new FormData(); fd.append("text", contractText);
                    handleProcess(fd, "Manuální vstup");
                  }}
                  disabled={loading || !contractText.trim()}
                  className="w-full rounded-xl bg-white py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#020617] transition-all hover:bg-cyan-400 hover:tracking-[0.4em] active:scale-95 disabled:opacity-10 shadow-xl"
                >
                  Provést audit
                </button>
              </div>
            </div>
          </section>

          {error && !loading && (
            <div className="flex items-center gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="text-red-500 shrink-0" />
              <p className="text-sm text-red-200 font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center">
              <div className="relative mb-8">
                <div className="h-20 w-20 rounded-[2rem] border-[3px] border-white/5 border-t-cyan-400 animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-pulse" size={24} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight animate-pulse">{loadingMessages[loadingStage]}</h3>
            </div>
          )}

          {analysis && !loading && (
            <section className="animate-fade-in-up pb-20">
              <div className="mb-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="text-left">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-3 animate-pulse">Audit Report Complete</h2>
                  <h3 className="text-4xl font-black text-white tracking-tight text-left animate-gradient-text bg-gradient-to-r from-white via-slate-400 to-white bg-[length:200%_auto] bg-clip-text text-transparent">Analytický výstup</h3>
                </div>
                <button 
                  onClick={() => router.push(`/consultation?uspora=${analysis.uspora}`)}
                  className="group flex items-center justify-center gap-4 rounded-2xl bg-indigo-600 px-10 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95"
                >
                  Personalizovaná konzultace
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </button>
              </div>

              <SavingsChart 
                uspora={analysis.uspora} 
                banka={analysis.top_nabidky?.[0]?.banka || "Tržní průměr"} 
              />

              <div className="grid gap-6 md:grid-cols-3 mb-12">
                <RecommendationCard icon={FileText} title="Termín Fixace" highlight={analysis.fixace} description="Otevřené okno pro bezpoplatkový transfer." badge="Datum" />
                <RecommendationCard icon={Zap} title="Delta měsíčně" highlight={`${(Number(analysis.uspora) || 0).toLocaleString()} Kč`} description="Okamžitý vliv na měsíční cashflow." badge="Výnos" />
                <RecommendationCard icon={ShieldCheck} title="Rating pojistky" highlight={analysis.pojisteni} description="Analýza rizikového krytí vůči jistině." badge="Bezpečí" />
              </div>

              <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 group transition-all duration-500 hover:border-indigo-500/20">
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
                          <th className="px-10 py-6 text-left text-cyan-400">Úspora / m</th>
                          <th className="px-10 py-6 text-left hidden md:table-cell">Strategická výhoda</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {analysis.top_nabidky?.map((item: any, i: number) => (
                          <tr key={i} className="group/row hover:bg-indigo-500/5 transition-all duration-300 text-left">
                            <td className="px-10 py-7 font-black text-white group-hover/row:text-cyan-400 transition-colors">{item?.banka || "—"}</td>
                            <td className="px-10 py-7 font-bold text-slate-400">{item?.sazba || "—"}</td>
                            <td className="px-10 py-7 font-black text-cyan-400 text-xl group-hover/row:scale-105 transition-transform origin-left">{Number(item?.usp || 0).toLocaleString()} Kč</td>
                            <td className="px-10 py-7 hidden md:table-cell">
                              <span className="rounded-xl bg-[#020617] border border-white/5 px-4 py-2 text-[10px] font-black text-slate-500 group-hover/row:text-indigo-400 group-hover/row:border-indigo-500/30 transition-all uppercase tracking-widest">
                                {item?.vyhoda || "Standardní podmínky"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-10 bg-white/5 border-t border-white/5">
                    <div className="flex gap-5 p-7 bg-[#020617]/60 rounded-3xl border border-white/5 shadow-inner text-left hover:border-indigo-500/20 transition-all">
                       <TrendingUp className="text-indigo-500 shrink-0 animate-bounce-slow" size={24} />
                       <p className="text-xs text-slate-400 leading-relaxed italic font-medium">
                         <span className="text-white font-bold not-italic uppercase text-[10px] block mb-1">Analytický závěr:</span>
                         {analysis.analyticky_duvod || "Analýza proběhla úspěšně."}
                       </p>
                    </div>
                  </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulse-gentle { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.01); opacity: 0.98; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.05); } }
        .animate-gradient-text { animation: gradient-text 5s ease infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}