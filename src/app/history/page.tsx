"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Trash2, 
  ChevronRight, 
  History,
  Zap,
  Layers,
  Search,
  AlertTriangle,
  X
} from "lucide-react";
import { ScrollToTop } from "../components/ScrollToTop";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useScrollDirection } from "../hooks/useScrollDirection";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null); // State pro grafické označení
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHeaderReady, setIsHeaderReady] = useState(false);
  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const pendingScrollIdRef = useRef<string | null>(null);
  const pendingHighlightIdRef = useRef<string | null>(null);
  const highlightStartTimeoutRef = useRef<number | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  useScrollDirection();
  useIntersectionObserver('.reveal', history.length);

  useEffect(() => {
    setMounted(true);
    let validatedHistory: any[] = [];
    
    try {
      const saved = JSON.parse(localStorage.getItem("finance_history") || "[]");
      validatedHistory = saved.map((item: any, index: number) => ({
        ...item,
        id: item.id || `id-${index}-${Date.now()}`
      }));
      setHistory(validatedHistory);
    } catch (e) {
      console.error("Chyba archivu:", e);
    }

    // Pokud máme kontext poslední analýzy, zvýrazníme ji
    try {
      const last = localStorage.getItem("last_analysis_data");
      if (last) {
        const parsed = JSON.parse(last);
        const idToHighlight = parsed?.id ? String(parsed.id) : null;

        if (idToHighlight) {
          pendingScrollIdRef.current = idToHighlight;
          pendingHighlightIdRef.current = idToHighlight;
        }

        // jednorázový kontext – po použití smažeme, aby se historie nezvýrazňovala při běžném otevření
        localStorage.removeItem("last_analysis_data");
      }
    } catch (e) {
      console.error("Chyba při načítání last_analysis_data:", e);
    }
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Headline má transition duration-1000; nastavíme bezpečnou rezervu,
    // pokud by z nějakého důvodu neproběhl onTransitionEnd.
    const t = window.setTimeout(() => {
      setIsHeaderReady(true);
    }, 1200);

    return () => window.clearTimeout(t);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !isHeaderReady) return;
    const idToScroll = pendingScrollIdRef.current;
    if (!idToScroll) return;

    // počkáme na render a naplnění refs; zkusíme párkrát, kdyby animace/observer přepsal style
    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      attempts += 1;
      const el = itemsRef.current[idToScroll];

      if (el) {
        // 1) nejprve necháme stránku normálně vykreslit, pak plynule odscrollujeme
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        pendingScrollIdRef.current = null;

        // 2) a až potom zvýrazníme (3s) + jemné dvojité zapulzování
        const highlightId = pendingHighlightIdRef.current || idToScroll;
        pendingHighlightIdRef.current = null;

        if (highlightStartTimeoutRef.current) {
          window.clearTimeout(highlightStartTimeoutRef.current);
        }
        if (highlightTimeoutRef.current) {
          window.clearTimeout(highlightTimeoutRef.current);
        }

        // "pomalý" scroll trvá typicky ~600–1200ms; nastavíme jemnou prodlevu
        highlightStartTimeoutRef.current = window.setTimeout(() => {
          setHighlightedId(highlightId);

          highlightTimeoutRef.current = window.setTimeout(() => {
            setHighlightedId((current) =>
              current === highlightId ? null : current,
            );
          }, 3400);
        }, 1100);

        return;
      }

      if (attempts < maxAttempts) {
        window.setTimeout(tryScroll, 50);
      }
    };

    // odložení na další frame, aby se props/refy stihly propsat do DOMu
    window.requestAnimationFrame(() => {
      window.setTimeout(tryScroll, 0);
    });

    return () => {
      // pokud by komponenta unmountla během čekání
      if (highlightStartTimeoutRef.current) {
        window.clearTimeout(highlightStartTimeoutRef.current);
        highlightStartTimeoutRef.current = null;
      }
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = null;
      }
    };
  }, [history.length, isLoaded, isHeaderReady]);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEntry(null);
      setDeleteId(null);
      setIsClosing(false);
    }, 300);
  };

  const handleEntryClick = (item: any) => {
    setHighlightedId(null); // Jakákoliv interakce zruší zvýraznění z prokliku
    setSelectedEntry(item);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const newHistory = history.filter(item => item.id !== deleteId);
      setHistory(newHistory);
      localStorage.setItem("finance_history", JSON.stringify(newHistory));
      if (selectedEntry?.id === deleteId) setSelectedEntry(null);
      setDeleteId(null);
    }
  };

  const handleReturnToAnalysis = (entry: any) => {
    localStorage.setItem("last_analysis_data", JSON.stringify(entry));
    router.push("/analysis");
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto max-w-4xl px-6 py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse-slow" />

        <header
          className={`mb-10 relative z-10 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) {
              setIsHeaderReady(true);
            }
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 ring-1 ring-indigo-500/30 backdrop-blur-md">
            <History size={12} className="text-cyan-400" />
            Data Archive Protocol
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white italic md:text-5xl">
            Moje <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-text not-italic">Historie</span>
          </h1>
        </header>
        
        {history.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center relative z-10 reveal">
            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-slate-700">
              <Layers size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Archiv je prázdný</p>
          </div>
        ) : (
          <div className="grid gap-4 relative z-10">
            {history.map((item, index) => {
              const isHighlighted = highlightedId === String(item.id);
              
              return (
                <div 
                  key={item.id}
                  onClick={() => handleEntryClick(item)}
                  ref={(el) => {
                    itemsRef.current[String(item.id)] = el;
                  }}
                  className={`reveal group relative overflow-hidden backdrop-blur-xl p-6 rounded-[2rem] border shadow-xl flex items-center justify-between cursor-pointer transition-all duration-700 ease-out ring-1 hover:scale-[1.01] active:scale-[0.99] ${
                    isHighlighted 
                    ? 'history-highlight bg-fuchsia-500/10 border-fuchsia-500/60 shadow-[0_0_40px_rgba(217,70,219,0.18)] ring-fuchsia-500/40 z-20' 
                    : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/60 ring-white/5'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-inner duration-500 ${
                      isHighlighted 
                      ? 'bg-fuchsia-500 text-white ring-2 ring-fuchsia-300/50' 
                      : 'bg-[#020617] text-indigo-400 ring-1 ring-white/10 group-hover:ring-cyan-500/50 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}>
                      <FileText size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-white tracking-tight text-lg group-hover:text-cyan-50 transition-colors">
                        {item.fileName || "Textová analýza"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 mt-1.5 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-indigo-500"/> {item.date}</span>
                        <span className="flex items-center gap-1.5 text-cyan-400 px-2 py-0.5 bg-cyan-500/10 rounded-md ring-1 ring-cyan-500/20">
                          <TrendingUp size={12}/> {Number(item.uspora || 0).toLocaleString()} Kč / měsíc
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item.id);
                      }} 
                      className="p-3 text-slate-600 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-500/10 relative z-20 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                      isHighlighted ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-white/5 text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'
                    }`}>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL: POTVRZENÍ SMAZÁNÍ */}
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm" style={{ animation: `${isClosing ? 'ui-fadeOut' : 'ui-fadeIn'} 0.3s ease-out forwards` }} onClick={closeModal} />
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[2rem] p-8 relative z-10 shadow-2xl" style={{ animation: `${isClosing ? 'ui-slideDown' : 'ui-slideUp'} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6 ring-1 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-white italic mb-2">Smazat záznam?</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-8">Tato akce je nevratná. Analýza bude trvale odstraněna.</p>
                <div className="flex gap-3 w-full">
                  <button onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all cursor-pointer">Zrušit</button>
                  <button onClick={confirmDelete} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all cursor-pointer">Odstranit</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DETAIL ANALÝZY */}
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" style={{ animation: `${isClosing ? 'ui-fadeOut' : 'ui-fadeIn'} 0.3s ease-out forwards` }} onClick={closeModal} />
            <div className="bg-slate-900 border border-white/10 w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative z-10 ring-1 ring-white/10" style={{ animation: `${isClosing ? 'ui-slideDown' : 'ui-slideUp'} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}>
              <div className="p-7 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-black text-white uppercase tracking-widest text-sm">Analýza Detail</h2>
                    <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em]">{selectedEntry.date}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-full transition-all text-slate-400 cursor-pointer"><X size={20} /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide text-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#020617]/60 border border-cyan-500/20 p-5 rounded-[1.5rem] shadow-inner text-left">
                    <p className="text-[9px] text-cyan-400 font-black uppercase tracking-widest mb-1">Měsíční úspora</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{Number(selectedEntry.uspora || 0).toLocaleString()} <span className="text-xs text-slate-500 font-medium">Kč</span></p>
                  </div>
                  <div className="bg-[#020617]/60 border border-indigo-500/20 p-5 rounded-[1.5rem] shadow-inner text-left">
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-1">Konec fixace</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{selectedEntry.fixace || "—"}</p>
                  </div>
                </div>
                <div className="space-y-3 pb-4 text-left">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Podrobný Report</h4>
                  <div className="report-container prose prose-invert prose-sm max-w-none bg-[#020617]/40 border border-white/5 p-6 rounded-2xl shadow-inner font-medium text-slate-400" dangerouslySetInnerHTML={{ __html: selectedEntry.textovy_obsah || "Obsah nebyl vygenerován." }} />
                </div>
              </div>
              <div className="p-6 bg-white/5 border-t border-white/5 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <button onClick={closeModal} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer">Zavřít</button>
                  <div className="flex flex-col md:flex-row gap-3 flex-1">
                    <button onClick={() => handleReturnToAnalysis(selectedEntry)} className="flex-1 px-6 py-3 bg-[#020617] border border-indigo-500/30 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/10 hover:border-indigo-500/60 transition-all flex items-center justify-center gap-2 group cursor-pointer"><Search size={14} className="group-hover:scale-110 transition-transform duration-300" /> Zobrazit analýzu</button>
                    <button onClick={() => router.push(`/consultation?uspora=${selectedEntry.uspora}&fixace=${selectedEntry.fixace}`)} className="flex-1 px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"><Zap size={14} className="group-hover:animate-pulse text-cyan-400" /> Přejít na konzultaci</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!selectedEntry && !deleteId && <ScrollToTop />}
      
      <style jsx global>{`
        ::-webkit-scrollbar { display: none !important; }
        .reveal { opacity: 0; transform: translateY(20px); will-change: transform, opacity; }
        @keyframes ui-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ui-fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes ui-slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes ui-slideDown { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(20px) scale(0.98); } }
        .animate-gradient-text { animation: gradient-text 6s ease infinite; }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        /* Zvýraznění po příchodu z analýzy: jemný růžový dvoj-puls (fuchsia) */
        .history-highlight {
          animation: history-highlight-pulse 3s ease-out 1;
        }
        @keyframes history-highlight-pulse {
          /* plynulý scale in/out + 2 jemné pulzy; konec postupně slábne */
          0%   { box-shadow: 0 0 0 rgba(217,70,219,0); transform: scale(1); }
          10%  { box-shadow: 0 0 0 rgba(217,70,219,0.00), 0 0 10px rgba(217,70,219,0.08); transform: scale(1.01); }
          18%  { box-shadow: 0 0 0 rgba(217,70,219,0.00), 0 0 28px rgba(217,70,219,0.22); transform: scale(1.015); }
          32%  { box-shadow: 0 0 0 rgba(217,70,219,0.00), 0 0 12px rgba(217,70,219,0.10); transform: scale(1.012); }
          52%  { box-shadow: 0 0 0 rgba(217,70,219,0.00), 0 0 34px rgba(217,70,219,0.24); transform: scale(1.015); }
          70%  { box-shadow: 0 0 0 rgba(217,70,219,0.00), 0 0 14px rgba(217,70,219,0.10); transform: scale(1.01); }
          100% { box-shadow: 0 0 0 rgba(217,70,219,0), transform: scale(1); }
        }
      `}</style>
    </div>
  );
}