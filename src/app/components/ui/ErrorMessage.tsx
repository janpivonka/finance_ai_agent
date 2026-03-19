import React from "react";
import { AlertCircle, X, RotateCcw } from "lucide-react";

interface ErrorMessageProps {
  error: string;
  onClear?: () => void;
  onRetry?: () => void;
  variant?: "rose" | "indigo" | "fuchsia" | "cyan";
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onClear, 
  onRetry, 
  variant = "rose",
  className = ""
}) => {
  const variants = {
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400 ring-rose-500/10",
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 ring-indigo-500/10",
    fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400 ring-fuchsia-500/10",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 ring-cyan-500/10",
  };

  return (
    <div className={`reveal relative z-50 flex items-center justify-between gap-4 rounded-3xl border px-8 py-5 backdrop-blur-xl ring-1 shadow-2xl ${variants[variant]} ${className}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-current/10 ring-1 ring-current/20`}>
          <AlertCircle size={20} className="animate-pulse" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Systémová chyba</p>
          <p className="text-sm font-black tracking-tight">{error}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-current/5 hover:bg-current/10 transition-all cursor-pointer"
          >
            <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform" />
          </button>
        )}
        {onClear && (
          <button 
            onClick={onClear}
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-current/5 hover:bg-current/10 transition-all cursor-pointer"
          >
            <X size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
