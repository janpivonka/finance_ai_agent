import React from "react";
import { AlertCircle, X, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

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
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 ring-rose-500/20 shadow-rose-500/10",
    indigo: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20 shadow-indigo-500/10",
    fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400 ring-fuchsia-500/20 shadow-fuchsia-500/10",
    cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 ring-cyan-500/20 shadow-cyan-500/10",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, height: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`relative z-[100] flex items-center justify-between gap-6 rounded-[2rem] border px-10 py-6 backdrop-blur-2xl ring-1 shadow-2xl ${variants[variant]} ${className}`}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-current/10 ring-1 ring-current/30 shadow-inner">
          <AlertCircle size={24} className="animate-pulse" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-1.5">Systémové hlášení</p>
          <p className="text-[15px] font-black tracking-tight leading-tight">{error}</p>
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
    </motion.div>
  );
};
