import React from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  onCancel?: () => void;
  variant?: "fuchsia" | "indigo" | "cyan";
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  title = "Navazuji spojení…", 
  description = "Pracujeme na vašem požadavku. Tato akce může trvat několik sekund.",
  onCancel,
  variant = "fuchsia",
  className = ""
}) => {
  if (!isVisible) return null;

  const variants = {
    fuchsia: "bg-fuchsia-500/10 ring-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400",
    indigo: "bg-indigo-500/10 ring-indigo-500/20 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
    cyan: "bg-cyan-500/10 ring-cyan-500/20 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-[color:var(--background)]/85 backdrop-blur-md ${className}`}>
      <div className={`mx-6 w-full max-w-md rounded-[2.5rem] border p-10 shadow-2xl ring-1 bg-[var(--panel-strong)] backdrop-blur-xl ${variants[variant]}`}>
        <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-current/5 ring-1 ring-current/20 shadow-[0_0_40px_rgba(217,70,219,0.12)]`}>
          <span className={`h-8 w-8 animate-spin rounded-full border-2 border-current/30 border-t-current`} />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[color:var(--foreground)]">
            {title}
          </p>
          <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed">
            {description}
          </p>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`mt-8 inline-flex items-center justify-center rounded-2xl border bg-current/5 px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer hover:bg-current/10 border-current/30 text-current`}
            >
              Zrušit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
