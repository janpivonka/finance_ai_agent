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
  X,
  Pencil,
  Check,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow
} from "lucide-react";
import { ScrollToTop } from "../components/ScrollToTop";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useScrollDirection } from "../hooks/useScrollDirection";

// Definice typů pro řazení
type SortField = "date" | "uspora" | "name";
type SortOrder = "asc" | "desc";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const { showScrollTop } = useScrollDirection();
  
  // --- NOVÉ STATES PRO FILTRY ---
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHeaderReady, setIsHeaderReady] = useState(false);
  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const pendingScrollIdRef = useRef<string | null>(null);
  const pendingHighlightIdRef = useRef<string | null>(null);
  const highlightStartTimeoutRef = useRef<number | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  useScrollDirection();

  // --- LOGIKA FILTROVÁNÍ A ŘAZENÍ ---
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      // Pro název chceme výchozí řazení asc (A-Z), pro ostatní desc
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  const filteredAndSortedHistory = history
    .filter((item) => {
      if (!searchQuery) return true;
      const s = searchQuery.toLowerCase();
      return (
        String(item?.fileName || "").toLowerCase().includes(s) ||
        String(item?.date || "").toLowerCase().includes(s) ||
        String(item?.uspora || "").toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "uspora") {
        comparison = Number(a.uspora || 0) - Number(b.uspora || 0);
      } else if (sortBy === "name") {
        comparison = (a.fileName || "").localeCompare(b.fileName || "");
      } else {
        // Fallback na ID/Datum
        comparison = (a.id || "").toString().localeCompare((b.id || "").toString());
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Observer sleduje počet vyfiltrovaných položek
  useIntersectionObserver('.reveal', filteredAndSortedHistory.length);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      let validatedHistory: any[] = [];
      try {
        const saved = JSON.parse(localStorage.getItem("finance_history") || "[]");
        validatedHistory = saved.map((item: any, index: number) => ({
          ...item,
          id: item.id || `id-${index}-${Date.now()}`
        }));
        setHistory(validatedHistory);
      } catch (e) { console.error("Chyba archivu:", e); }

      try {
        const last = localStorage.getItem("last_analysis_data");
        if (last) {
          const parsed = JSON.parse(last);
          const idToHighlight = parsed?.id ? String(parsed.id) : null;
          if (idToHighlight) {
            pendingScrollIdRef.current = idToHighlight;
            pendingHighlightIdRef.current = idToHighlight;
          }
          localStorage.removeItem("last_analysis_data");
        }
      } catch (e) { console.error("Chyba last_analysis_data:", e); }
    }
    
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const t = window.setTimeout(() => setIsHeaderReady(true), 1200);
    return () => window.clearTimeout(t);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !isHeaderReady) return;
    const idToScroll = pendingScrollIdRef.current;
    if (!idToScroll) return;

    // Počkáme na dokončení animace nadpisu
    const el = itemsRef.current[idToScroll];
    if (el) {
      // Plynulý smooth scroll až po animaci
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      
      const highlightId = pendingHighlightIdRef.current || idToScroll;

      if (highlightStartTimeoutRef.current) window.clearTimeout(highlightStartTimeoutRef.current);
      if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current);

      // Highlight začíná krátce po dokončení scrollu
      highlightStartTimeoutRef.current = window.setTimeout(() => {
        setHighlightedId(highlightId);
        highlightTimeoutRef.current = window.setTimeout(() => {
          setHighlightedId((current) => current === highlightId ? null : current);
        }, 2500);
      }, 500); // Malé zpoždění pro plynulý přechod po scrollu
    }
  }, [isLoaded, isHeaderReady]);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEntry(null);
      setDeleteId(null);
      setIsClosing(false);
    }, 300);
  };

  const handleEntryClick = (item: any) => {
    setHighlightedId(null);
    setSelectedEntry(item);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const newHistory = history.filter(item => item.id !== deleteId);
      setHistory(newHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem("finance_history", JSON.stringify(newHistory));
      }
      if (selectedEntry?.id === deleteId) setSelectedEntry(null);
      setDeleteId(null);
    }
  };

  const handleReturnToAnalysis = (entry: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("analysis_entry_data", JSON.stringify(entry));
    }
    router.push("/analysis");
  };

  const handleRename = (id: string, newName: string) => {
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, fileName: newName } : item
    );
    setHistory(updatedHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem("finance_history", JSON.stringify(updatedHistory));
    }
    setSelectedEntry((prev: any) => ({ ...prev, fileName: newName }));
    setIsEditingName(false);
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto max-w-4xl px-6 py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse-slow" />

        <header
          className={`mb-12 relative z-10 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 ring-1 ring-indigo-500/30 backdrop-blur-md">
            <History size={12} className="text-cyan-400" />
            Data Archive Protocol
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white italic md:text-5xl mb-6">
            Moje <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-text not-italic">Historie</span>
          </h1>

          {/* PODNADPIS */}
          <div className="border-l border-indigo-500/40 pl-6 py-1 mb-10">
             <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xl">
               Kompletní přehled vašich finančních analýz. Data jsou ukládána lokálně a synchronizována pro okamžitý přístup.
             </p>
          </div>

          {/* FILTRY A VYHLEDÁVÁNÍ */}
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="relative flex-1 group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10" />
              <input
                type="text"
                placeholder="Hledat v archivu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500/40 backdrop-blur-xl transition-all"
              />
              {searchQuery && (
                <X 
                  size={16} 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer" 
                />
              )}
            </div>

            <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
              {(['date', 'uspora', 'name'] as SortField[]).map((field) => {
                const isActive = sortBy === field;
                return (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      isActive 
                      ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {field === 'date' ? 'Datum' : field === 'uspora' ? 'Úspora' : 'Název'}
                    {isActive && (
                      sortOrder === 'asc' ? <ArrowUpNarrowWide size={14} /> : <ArrowDownWideNarrow size={14} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </header>
        
        {filteredAndSortedHistory.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center relative z-10 reveal">
            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-slate-700">
              <Layers size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              {searchQuery ? "Nebylo nic nalezeno" : "Archiv je prázdný"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 relative z-10">
            {filteredAndSortedHistory.map((item, index) => {
              const isHighlighted = highlightedId === String(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => handleEntryClick(item)}
                  ref={(el) => { itemsRef.current[String(item.id)] = el; }}
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
                      <h3 className={`font-black tracking-tight text-lg group-hover:text-cyan-50 transition-colors ${
                        sortBy === 'name' ? 'text-fuchsia-400' : 'text-white'
                      }`}>
                        {item.fileName || "Textová analýza"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 mt-1.5 font-bold uppercase tracking-widest">
                        <span className={`flex items-center gap-1.5 ${
                          sortBy === 'date' ? 'text-fuchsia-400' : ''
                        }`}>
                          <Calendar size={12} className={sortBy === 'date' ? 'text-fuchsia-400' : 'text-indigo-500'}/> {item.date}
                        </span>
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 transition-colors ${
                          sortBy === 'uspora' 
                            ? 'text-fuchsia-400 bg-fuchsia-500/10 ring-fuchsia-500/20' 
                            : 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/20'
                        }`}>
                          <TrendingUp size={12} className={sortBy === 'uspora' ? 'text-fuchsia-400' : 'text-cyan-400'}/> {Number(item.uspora || 0).toLocaleString()} Kč / měsíc
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

        {/* ... MODALY ZŮSTÁVAJÍ STEJNÉ ... */}
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

        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" style={{ animation: `${isClosing ? 'ui-fadeOut' : 'ui-fadeIn'} 0.3s ease-out forwards` }} onClick={closeModal} />
            <div className="bg-slate-900 border border-white/10 w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative z-10 ring-1 ring-white/10" style={{ animation: `${isClosing ? 'ui-slideDown' : 'ui-slideUp'} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}>
              <div className="p-7 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      {isEditingName ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(selectedEntry.id, tempName);
                              } else if (e.key === 'Escape') {
                                setIsEditingName(false);
                                setTempName(selectedEntry.fileName || "");
                              }
                            }}
                            autoFocus
                            className="bg-slate-800/50 border border-indigo-500/50 rounded-lg px-2 py-1 text-sm font-black text-white uppercase tracking-widest outline-none focus:border-indigo-400"
                          />
                          <button
                            onClick={() => handleRename(selectedEntry.id, tempName)}
                            className="h-6 w-6 flex items-center justify-center bg-green-600 hover:bg-green-500 rounded transition-colors"
                          >
                            <Check size={14} className="text-white" />
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingName(false);
                              setTempName(selectedEntry.fileName || "");
                            }}
                            className="h-6 w-6 flex items-center justify-center bg-rose-600 hover:bg-rose-500 rounded transition-colors"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h2 className="font-black text-white uppercase tracking-widest text-sm">
                            {selectedEntry.fileName || "Textová analýza"}
                          </h2>
                          <button
                            onClick={() => {
                              setIsEditingName(true);
                              setTempName(selectedEntry.fileName || "");
                            }}
                            className="h-6 w-6 flex items-center justify-center hover:text-indigo-400 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em]">{selectedEntry.date}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="h-10 w-10 flex items-center justify-center bg-slate-800/50 hover:bg-rose-500/20 hover:text-rose-500 rounded-full transition-all text-slate-400 cursor-pointer"><X size={20} /></button>
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
                  <div className="report-container prose prose-invert prose-sm max-w-none bg-[#020617]/40 border border-white/5 p-6 rounded-2xl shadow-inner font-medium text-slate-300" dangerouslySetInnerHTML={{ __html: selectedEntry.textovy_obsah || "Obsah nebyl vygenerován." }} />
                </div>
              </div>
              <div className="p-6 bg-slate-900/50 border-t border-white/5 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <button onClick={closeModal} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer">Zavřít</button>
                  <div className="flex flex-col md:flex-row gap-3 flex-1">
                    <button onClick={() => handleReturnToAnalysis(selectedEntry)} className="flex-1 px-6 py-3 bg-[#020617] border border-indigo-500/30 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/10 hover:border-indigo-500/60 transition-all flex items-center justify-center gap-2 group cursor-pointer"><Search size={14} className="group-hover:scale-110 transition-transform duration-300" /> Zobrazit analýzu</button>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          try {
                            if (selectedEntry?.id) {
                              localStorage.setItem("last_analysis_data", JSON.stringify({ id: selectedEntry.id }));
                            }
                          } catch (e) { console.error(e); }
                        }
                        router.push(`/consultation?id=${encodeURIComponent(String(selectedEntry.id))}&uspora=${encodeURIComponent(String(selectedEntry.uspora))}&fixace=${encodeURIComponent(String(selectedEntry.fixace))}`);
                      }}
                      className="flex-1 px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <Zap size={14} className="group-hover:animate-pulse text-cyan-400" /> Přejít na konzultaci
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ScrollToTop forceShow={!selectedEntry && !deleteId} />
      
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

        .history-highlight {
          animation: history-highlight-pulse 3s ease-out 1;
        }
        @keyframes history-highlight-pulse {
          0%   { box-shadow: 0 0 0 rgba(217,70,219,0); transform: scale(1); }
          10%  { box-shadow: 0 0 28px rgba(217,70,219,0.22); transform: scale(1.015); }
          52%  { box-shadow: 0 0 34px rgba(217,70,219,0.24); transform: scale(1.015); }
          100% { box-shadow: 0 0 0 rgba(217,70,219,0), transform: scale(1); }
        }

        .report-container, .report-container * {
          background-color: transparent !important;
          background: transparent !important;
        }
        .report-container strong { color: #fff !important; }
        .report-container h1, .report-container h2, .report-container h3 { color: #f8fafc !important; font-weight: 800; }
        .report-container p, .report-container li { color: #cbd5e1 !important; }
        .report-container table { border-collapse: collapse; width: 100%; }
        .report-container td { color: #e2e8f0 !important; font-size: 0.85rem; }
        .report-container th { 
          color: #38bdf8 !important; 
          text-transform: uppercase; 
          font-size: 0.75rem; 
          letter-spacing: 0.05em;
          background-color: rgba(255,255,255,0.03) !important;
        }
        .report-container td:nth-child(2) { 
          color: #ec4899 !important; 
          font-weight: 700; 
        }
        .report-container td:nth-child(3) { 
          color: #4ade80 !important; 
          font-weight: 700; 
        }
        .report-container table, .report-container td, .report-container th {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
