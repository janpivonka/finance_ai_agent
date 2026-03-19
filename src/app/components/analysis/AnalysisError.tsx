import React from "react";
import { AlertCircle, RotateCcw, X } from "lucide-react";

interface AnalysisErrorProps {
  error: string;
  onClear: () => void;
}

export const AnalysisError: React.FC<AnalysisErrorProps> = ({ error, onClear }) => (
  <div className="reveal-init max-w-2xl mx-auto w-full mb-6">
    <div className="relative group overflow-hidden rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-rose-500/50">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/20 transition-all duration-700" />
      <div className="relative flex items-start gap-4 text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-rose-400">Chyba analýzy</h3>
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            {error}
          </p>
          <button 
            onClick={onClear}
            className="mt-4 text-[10px] font-black uppercase tracking-widest text-rose-400/60 hover:text-rose-400 transition-colors flex items-center gap-2 group/btn cursor-pointer"
          >
            <RotateCcw size={12} className="group-hover/btn:rotate-[-90deg] transition-transform" />
            Zkusit znovu
          </button>
        </div>
        <button 
          onClick={onClear}
          className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  </div>
);
