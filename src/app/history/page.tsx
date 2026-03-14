"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Trash2, 
  ChevronRight, 
  Info, 
  X,
  History,
  Zap,
  Layers,
  AlertCircle
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem("finance_history") || "[]");
      const validatedHistory = saved.map((item: any, index: number) => ({
        ...item,
        id: item.id || `id-${index}-${Date.now()}`
      })).reverse(); 
      setHistory(validatedHistory);
    } catch (e) {
      console.error("Chyba archivu:", e);
    }
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEntry(null);
      setIsClosing(false);
    }, 300);
  };

  const deleteEntry = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Odstranit tento záznam z historie?")) {
      const newHistory = history.filter(item => item.id !== id);
      setHistory(newHistory);
      localStorage.setItem("finance_history", JSON.stringify(newHistory));
      if (selectedEntry?.id === id) closeModal();
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-4xl px-6 py-12 relative">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-indigo-600/10 blur-[120px] pointer-events-none" />

        <header className="mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 ring-1 ring-indigo-500/30">
            <History size={12} className="text-cyan-400" />
            Data Archive Protocol
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white italic">
            Moje <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 not-italic">Historie</span>
          </h1>
        </header>
        
        {history.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center relative z-10">
            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-slate-700">
              <Layers size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Archiv je prázdný</p>
          </div>
        ) : (
          <div className="grid gap-4 relative z-10">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedEntry(item)}
                className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 shadow-xl flex items-center justify-between cursor-pointer hover:border-indigo-500/40 transition-all hover:bg-slate-900/60 ring-1 ring-white/5 hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 bg-[#020617] rounded-2xl flex items-center justify-center text-indigo-400 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-inner">
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
                  <button onClick={(e) => deleteEntry(item.id, e)} className="p-3 text-slate-600 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-500/10 relative z-20">
                    <Trash2 size={18} />
                  </button>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <div 
              className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md"
              style={{ animation: `${isClosing ? 'ui-fadeOut' : 'ui-fadeIn'} 0.3s ease-out forwards` }}
              onClick={closeModal} 
            />
            
            <div 
              className="bg-slate-900 border border-white/10 w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative z-10 ring-1 ring-white/10"
              style={{ animation: `${isClosing ? 'ui-slideDown' : 'ui-slideUp'} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}
            >
              {/* Header */}
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
                <button onClick={closeModal} className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-full transition-all text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide text-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#020617]/60 border border-cyan-500/20 p-5 rounded-[1.5rem] shadow-inner text-left">
                    <p className="text-[9px] text-cyan-400 font-black uppercase tracking-widest mb-1">Měsíční úspora</p>
                    <p className="text-3xl font-black text-white tracking-tighter">
                      {Number(selectedEntry.uspora || 0).toLocaleString()} <span className="text-xs text-slate-500 font-medium">Kč</span>
                    </p>
                  </div>
                  <div className="bg-[#020617]/60 border border-indigo-500/20 p-5 rounded-[1.5rem] shadow-inner text-left">
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-1">Konec fixace</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{selectedEntry.fixace || "—"}</p>
                  </div>
                </div>

                {/* Sekce Briefing s kontrolou duplicity */}
                {selectedEntry.analyticky_duvod && 
                 !selectedEntry.textovy_obsah?.replace(/<[^>]*>/g, '').includes(selectedEntry.analyticky_duvod.substring(0, 50)) && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 text-left">
                      <AlertCircle size={14} className="text-indigo-400" />
                      AI Agent Briefing
                    </h4>
                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl text-[13px] leading-relaxed italic text-slate-400 shadow-inner text-left">
                      "{selectedEntry.analyticky_duvod}"
                    </div>
                  </div>
                )}

                {/* Report Content */}
                <div className="space-y-3 pb-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 text-left">Podrobný Report</h4>
                  <div 
                    className="report-container prose prose-invert prose-sm max-w-none bg-[#020617]/40 border border-white/5 p-6 rounded-2xl shadow-inner font-medium text-slate-400 text-left"
                    dangerouslySetInnerHTML={{ __html: selectedEntry.textovy_obsah || "Obsah nebyl vygenerován." }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-white/5 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="hidden md:flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <Info size={14} className="text-indigo-400" />
                  Lokální šifrovaný archiv
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={closeModal} className="flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                    Zavřít
                  </button>
                  <button 
                    onClick={() => router.push(`/consultation?uspora=${selectedEntry.uspora}&fixace=${selectedEntry.fixace}`)}
                    className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 group"
                  >
                    <Zap size={14} className="group-hover:animate-pulse text-cyan-400" />
                    Reaktivovat audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        @keyframes ui-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ui-fadeOut { from { opacity: 1; } to { opacity: 0; } }

        @keyframes ui-slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes ui-slideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.98); }
        }

        /* Čištění podrobného reportu (přebíjení bílého pozadí) */
        .report-container, .report-container div, .report-container span {
          background-color: transparent !important;
          color: #94a3b8 !important; /* slate-400 */
        }
        .report-container h1, .report-container h2, .report-container h3 {
          color: #818cf8 !important; /* indigo-400 */
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
          font-weight: 900;
        }
        .report-container strong { color: #fff !important; font-weight: 900; }
        .report-container p { margin-bottom: 1rem; line-height: 1.6; }
      `}</style>
    </div>
  );
}