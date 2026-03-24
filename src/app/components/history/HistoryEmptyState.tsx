import React from "react";
import { motion } from "framer-motion";
import { Layers, FileSearch, Mic2, ArrowRight } from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";

interface HistoryEmptyStateProps {
  searchQuery: string;
}

export const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({ searchQuery }) => {
  const { goToAnalysis, goToConsultation } = useAppNavigation();

  return (
    <motion.div 
      key="empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-20 px-6 bg-[var(--panel)] backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-[color:var(--panel-border)] flex flex-col items-center relative z-10 reveal"
    >
      <div className="h-20 w-20 rounded-3xl bg-[var(--panel-strong)] flex items-center justify-center mb-6 text-[color:var(--muted-2)]">
        <Layers size={32} />
      </div>
      
      <div className="mb-12">
        <p className="text-[color:var(--foreground)] font-black uppercase tracking-[0.2em] text-sm mb-2">
          {searchQuery ? "Žádné výsledky" : "Váš archiv je zatím prázdný"}
        </p>
        <p className="text-[color:var(--muted)] text-xs font-medium max-w-xs mx-auto leading-relaxed">
          {searchQuery 
            ? "Zkuste upravit parametry vyhledávání nebo filtrů." 
            : "Zatím jste neprovedli žádnou analýzu. Začněte nyní a ušetřete na své hypotéce."}
        </p>
      </div>

      {!searchQuery && (
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl justify-center">
          <button
            onClick={() => goToAnalysis()}
            className="group relative flex flex-1 items-center justify-between gap-4 overflow-hidden rounded-[1.8rem] bg-indigo-600 p-6 transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <FileSearch size={24} />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-200">Start</span>
                <span className="block text-sm font-black text-white uppercase">První analýza</span>
              </div>
            </div>
            <ArrowRight size={20} className="text-white opacity-50 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => goToConsultation()}
            className="group relative flex flex-1 items-center justify-between gap-4 overflow-hidden rounded-[1.8rem] bg-[var(--panel-strong)] border border-[color:var(--panel-border-strong)] p-6 transition-all hover:bg-[var(--panel)] hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer bg-tint-blue"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400">
                <Mic2 size={24} />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[color:var(--muted-2)]">Nevíte jak dál?</span>
                <span className="block text-sm font-black text-[color:var(--foreground)] uppercase">Hlasový asistent</span>
              </div>
            </div>
            <ArrowRight size={20} className="text-[color:var(--muted-2)] opacity-50 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
