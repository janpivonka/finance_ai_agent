import React from "react";
import { UploadCloud, Zap } from "lucide-react";
import { useTheme } from "../ui/ThemeProvider";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";

interface AnalysisUploadProps {
  contractText: string;
  onTextChange: (text: string) => void;
  onProcess: (formData: FormData, fileName: string) => void;
  loading: boolean;
}

export const AnalysisUpload: React.FC<AnalysisUploadProps> = ({ 
  contractText, 
  onTextChange, 
  onProcess,
  loading
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { activeId, handleInteraction } = useMobileInteraction();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      handleInteraction('file-upload', () => {
        const fd = new FormData();
        fd.append("file", f);
        onProcess(fd, f.name);
      }, 250);
    }
  };

  const handleManualSubmit = () => {
    handleInteraction('manual-submit', () => {
      const fd = new FormData();
      fd.append("text", contractText);
      onProcess(fd, "Manuální vstup textu");
    }, 250);
  };

  return (
    <section className="reveal-init rounded-[3.5rem] border border-[color:var(--panel-border)] bg-[var(--panel)] backdrop-blur-2xl p-2 md:p-3 shadow-2xl ring-1 ring-[color:var(--panel-border)] transition-all duration-500 max-w-5xl mx-auto w-full group/main">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr] items-center bg-[var(--panel-strong)] rounded-[3.2rem] p-6 md:p-8">
        <label className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-[color:var(--panel-border)] bg-[var(--panel)] p-8 transition-all duration-500 overflow-hidden min-h-[220px] ${
          isDark 
            ? "hover:border-cyan-500/50 hover:bg-cyan-500/5" 
            : "hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5"
        } ${activeId === 'file-upload' ? (isDark ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-fuchsia-500/50 bg-fuchsia-500/5') : ''}`}>
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-transparent ${
            isDark ? "from-indigo-500/10" : "from-emerald-500/10"
          } ${activeId === 'file-upload' ? 'opacity-100' : ''}`} />
          <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
            isDark 
              ? "bg-indigo-600 group-hover:bg-cyan-500 group-hover:shadow-cyan-500/40" 
              : "bg-emerald-600 group-hover:bg-fuchsia-600 group-hover:shadow-fuchsia-500/40"
          } ${activeId === 'file-upload' ? (isDark ? 'bg-cyan-500 shadow-cyan-500/40 scale-110 rotate-3' : 'bg-fuchsia-600 shadow-fuchsia-500/40 scale-110 rotate-3') : ''}`}>
            <UploadCloud size={28} className={activeId === 'file-upload' ? 'animate-bounce' : 'group-hover:animate-bounce'} />
          </div>
          <div className="relative text-center">
            <p className="text-sm font-black text-[color:var(--foreground)] tracking-widest uppercase mb-1">
              Nahrát PDF smlouvu
            </p>
            <p className="text-[10px] text-[color:var(--muted-2)] font-bold uppercase tracking-widest opacity-60">Neural OCR Scan</p>
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
        </label>

        <div className="flex md:flex-col items-center gap-4 py-2 md:py-0">
          <div className="h-px md:h-20 w-full md:w-px bg-gradient-to-b from-transparent via-[color:var(--panel-border)] to-transparent" />
          <span className="text-[10px] font-black text-[color:var(--muted-2)] uppercase tracking-tighter border border-[color:var(--panel-border)] rounded-full p-2 bg-[var(--panel)] shadow-xl">NEBO</span>
          <div className="h-px md:h-20 w-full md:w-px bg-gradient-to-t from-transparent via-[color:var(--panel-border)] to-transparent" />
        </div>

        <div className="flex flex-col gap-4 h-full text-left">
          <div className="relative group/input flex-1">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2rem] opacity-0 group-focus-within/input:opacity-20 transition duration-500 blur" />
            <textarea
              placeholder="Vložte text smlouvy pro rychlý screening..."
              value={contractText}
              onChange={(e) => onTextChange(e.target.value)}
              className="relative w-full h-[180px] md:h-full rounded-[1.8rem] border border-[color:var(--panel-border)] bg-[var(--panel-strong)] p-6 text-sm text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-[color:var(--panel-border-strong)] resize-none font-medium transition-all placeholder:text-[color:var(--muted-2)]"
            />
          </div>
          <button
            onClick={handleManualSubmit}
            disabled={loading || !contractText.trim()}
            className={`group relative overflow-hidden rounded-[1.5rem] bg-[var(--button-primary-bg)] px-8 py-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] enabled:hover:scale-[1.05] enabled:hover:-translate-y-1 active:scale-95 disabled:opacity-40 shadow-2xl enabled:cursor-pointer disabled:cursor-not-allowed border border-transparent enabled:hover:border-indigo-400/30 enabled:hover:shadow-indigo-500/40 ${activeId === 'manual-submit' ? 'scale-[1.05] -translate-y-1 border-indigo-400/30 shadow-indigo-500/40' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 opacity-0 enabled:group-hover:opacity-100 transition-opacity duration-500 ${activeId === 'manual-submit' ? 'opacity-100' : ''}`} />
            <span className={`relative flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--button-primary-text)] enabled:group-hover:text-white transition-colors duration-500 ${activeId === 'manual-submit' ? 'text-white' : ''}`}>
              Spustit Audit <Zap size={14} className={`fill-current ${activeId === 'manual-submit' ? 'animate-pulse' : 'group-hover:animate-pulse'}`} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
