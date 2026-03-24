import React, { useEffect, useRef } from "react";
import {
  Zap,
  FileText,
  Pencil,
  Check,
  X,
  Mail,
  History,
  ArrowRight,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { useInView } from "framer-motion";
import { AnalysisResult } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";
import { SavingsChart } from "./SavingsChart";
import { RecommendationCard } from "./RecommendationCard";

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  displayUspora: number;
  uploadedFileName: string | null;
  isEditingFileName: boolean;
  setIsEditingFileName: (val: boolean) => void;
  tempFileName: string;
  setTempFileName: (val: string) => void;
  handleRenameFile: (name: string) => void;
  onResultsEnterViewport: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  displayUspora,
  uploadedFileName,
  isEditingFileName,
  setIsEditingFileName,
  tempFileName,
  setTempFileName,
  handleRenameFile,
  onResultsEnterViewport
}) => {
  const { goToHistory, goToConsultation } = useAppNavigation();
  const { activeId, handleInteraction } = useMobileInteraction();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(headerRef, { amount: 0.6, once: false });
  const wasInViewRef = useRef(false);

  useEffect(() => {
    if (inView && !wasInViewRef.current) {
      wasInViewRef.current = true;
      onResultsEnterViewport();
      return;
    }

    if (!inView) wasInViewRef.current = false;
  }, [inView, onResultsEnterViewport]);

  return (
    <section className="pb-20 space-y-12">
      <div className="reveal mb-10 h-px bg-gradient-to-r from-transparent via-[color:var(--panel-border)] to-transparent" />
      
      <div ref={headerRef} className="reveal mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 animate-pulse">Audit Report Complete</h2>
          </div>
          <h3 className="text-4xl font-black text-[color:var(--foreground)] tracking-tight text-left">
            Vaše měsíční úspora činí <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{formatCurrency(displayUspora)}</span>
          </h3>
          
          <div className="mt-6 space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[var(--panel)] border border-[color:var(--panel-border)] shadow-sm animate-fade-in">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20">
                <FileText size={12} className="text-indigo-400" />
              </div>
              <span className="text-[10px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Zdroj:</span>
              {isEditingFileName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempFileName}
                    onChange={(e) => setTempFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameFile(tempFileName);
                      } else if (e.key === 'Escape') {
                        setIsEditingFileName(false);
                        setTempFileName(uploadedFileName || "");
                      }
                    }}
                    autoFocus
                    className="bg-[var(--panel-strong)] border border-indigo-500/50 rounded-lg px-2 py-1 text-xs font-black text-[color:var(--foreground)] outline-none focus:border-indigo-400 max-w-[200px]"
                  />
                  <button
                    onClick={() => handleRenameFile(tempFileName)}
                    className="h-5 w-5 flex items-center justify-center bg-green-600 hover:bg-green-500 rounded transition-colors cursor-pointer"
                  >
                    <Check size={12} className="text-white" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingFileName(false);
                      setTempFileName(uploadedFileName || "");
                    }}
                    className="h-5 w-5 flex items-center justify-center bg-rose-600 hover:bg-rose-500 rounded transition-colors cursor-pointer"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-[color:var(--foreground)] truncate max-w-[250px] md:max-w-md">
                    {uploadedFileName || "Manuální vstup dat"}
                  </span>
                  <button
                    onClick={() => {
                      setIsEditingFileName(true);
                      setTempFileName(uploadedFileName || "");
                    }}
                    className="h-5 w-5 flex items-center justify-center text-[color:var(--muted)] hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <Mail size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Odesláno na email</span>
              </div>

              <button 
                onClick={() => handleInteraction('go-to-history', () => goToHistory(analysis.id))}
                className={`flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer group/badge animate-fade-in ${activeId === 'go-to-history' ? 'bg-indigo-500/20 border-indigo-500/40 scale-95' : ''}`}
                style={{ animationDelay: '0.2s' }}
              >
                <History size={12} className={`text-indigo-600 dark:text-indigo-300 group-hover/badge:rotate-[-45deg] transition-transform ${activeId === 'go-to-history' ? 'rotate-[-45deg]' : ''}`} />
                <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">Dostupné v historii</span>
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleInteraction('consultation', () => goToConsultation(analysis))}
          className={`group flex items-center justify-center gap-4 rounded-2xl bg-indigo-600 px-10 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95 cursor-pointer ${activeId === 'consultation' ? 'bg-indigo-500 scale-95 shadow-[0_0_40px_rgba(79,70,229,0.5)]' : ''}`}
        >
          Personalizovaná konzultace
          <ArrowRight size={18} className={`transition-transform group-hover:translate-x-2 ${activeId === 'consultation' ? 'translate-x-2' : ''}`} />
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
        <div className="reveal">
          <RecommendationCard 
            onClick={() => handleInteraction('rec-fix', () => {})}
            isActive={activeId === 'rec-fix'}
            icon={FileText} 
            title="Termín Fixace" 
            highlight={analysis.fixace} 
            description="Otevřené okno pro bezpoplatkový transfer." 
            badge="Datum" 
          />
        </div>
        <div className="reveal">
          <RecommendationCard 
            onClick={() => handleInteraction('rec-cash', () => {})}
            isActive={activeId === 'rec-cash'}
            icon={Wallet} 
            title="Měsíční cashflow" 
            highlight={`+${Math.floor(displayUspora).toLocaleString()} Kč`} 
            description="Čistá úspora uvolněná do vašeho rozpočtu." 
            badge="Výnos" 
          />
        </div>
        <div className="reveal">
          <RecommendationCard 
            onClick={() => handleInteraction('rec-insurance', () => {})}
            isActive={activeId === 'rec-insurance'}
            icon={ShieldCheck} 
            title="Rating pojistky" 
            highlight={analysis.pojisteni} 
            description="Analýza rizikového krytí vůči jistině." 
            badge="Bezpečí" 
          />
        </div>
      </div>

      <div className="reveal overflow-hidden rounded-[2.5rem] border border-[color:var(--panel-border)] bg-[var(--panel)] backdrop-blur-xl shadow-2xl ring-1 ring-[color:var(--panel-border)] group transition-all duration-500 hover:border-indigo-500/20">
          <div className="px-10 py-7 bg-[var(--panel-strong)] border-b border-[color:var(--panel-border)] flex items-center justify-between">
              <h3 className="font-black text-[color:var(--foreground)] tracking-widest uppercase text-xs">Benchmark Top nabídek</h3>
              <div className="flex items-center gap-2 text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase bg-cyan-400/10 px-4 py-1.5 rounded-full ring-1 ring-cyan-500/20 animate-pulse">
                <CheckCircle2 size={12}/> Market Verified
              </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead className="bg-[var(--background)]/30 text-[9px] font-black uppercase tracking-[0.2em] text-[color:var(--muted-2)]">
                <tr>
                  <th className="px-6 md:px-10 py-6 text-left">Instituce</th>
                  <th className="px-6 md:px-10 py-6 text-left">Sazba</th>
                  <th className="px-6 md:px-10 py-6 text-left">Měsíční úspora</th>
                  <th className="px-6 md:px-10 py-6 text-left">Strategická výhoda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--panel-border)]">
                {analysis.top_nabidky?.map((item, i) => {
                  const localUspora = Number(item?.usp || 0);
                  const formattedUspora = Math.floor(localUspora * (displayUspora / (Number(analysis.uspora) || 1))).toLocaleString();
                  return (
                    <tr key={i} className="group/row hover:bg-indigo-500/5 transition-all duration-300 text-left">
                      <td className="px-6 md:px-10 py-7 font-black text-[color:var(--foreground)] group-hover/row:text-cyan-600 dark:group-hover/row:text-cyan-400 transition-colors whitespace-nowrap">{item?.banka || "—"}</td>
                      <td className="px-6 md:px-10 py-7 font-black text-fuchsia-600 dark:text-fuchsia-400 whitespace-nowrap">{item?.sazba || "—"}</td>
                      <td className="px-6 md:px-10 py-7 font-black text-emerald-600 dark:text-emerald-400 text-lg md:text-xl group-hover/row:scale-105 transition-transform origin-left whitespace-nowrap">
                         +{formattedUspora} Kč
                      </td>
                      <td className="px-6 md:px-10 py-7">
                        <span className="inline-block rounded-xl bg-[var(--background)] dark:bg-[#020617] border border-[color:var(--panel-border)] px-4 py-2 text-[9px] md:text-[10px] font-black text-[color:var(--muted)] group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 group-hover/row:border-indigo-500/30 transition-all uppercase tracking-widest shadow-inner whitespace-nowrap md:whitespace-normal">
                          {item?.vyhoda || "Standardní podmínky"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-10 bg-[var(--panel-strong)] dark:bg-white/5 border-t border-[color:var(--panel-border)] text-left">
            <div className="flex gap-5 p-7 bg-[var(--panel)] dark:bg-[#020617]/60 rounded-3xl border border-[color:var(--panel-border-strong)] shadow-inner bg-tint-indigo">
                <TrendingUp className="text-indigo-600 dark:text-indigo-500 shrink-0" size={24} />
                <div className="text-xs text-[color:var(--foreground-muted)] dark:text-slate-400 leading-relaxed italic font-medium">
                  <span className="text-[color:var(--foreground)] dark:text-white font-bold not-italic uppercase text-[10px] block mb-1">Strategické doporučení AI:</span>
                  {analysis.kreativni_vypocet || analysis.analyticky_duvod || "Vaše úspora je připravena k uvolnění."}
                </div>
            </div>
          </div>
      </div>
    </section>
  );
};
