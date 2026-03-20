import React from "react";
import { UploadCloud, Zap } from "lucide-react";

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const fd = new FormData();
      fd.append("file", f);
      onProcess(fd, f.name);
    }
  };

  const handleManualSubmit = () => {
    const fd = new FormData();
    fd.append("text", contractText);
    onProcess(fd, "Manuální vstup textu");
  };

  return (
    <section className="reveal-init rounded-[3.5rem] border border-[color:var(--panel-border)] bg-[var(--panel)] backdrop-blur-2xl p-2 md:p-3 shadow-2xl ring-1 ring-[color:var(--panel-border)] transition-all duration-500 max-w-5xl mx-auto w-full group/main">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr] items-center bg-[var(--panel-strong)] rounded-[3.2rem] p-6 md:p-8">
        <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-[color:var(--panel-border)] bg-[var(--panel)] p-8 transition-all duration-500 hover:border-cyan-500/50 hover:bg-cyan-500/5 overflow-hidden min-h-[220px]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-cyan-500 group-hover:shadow-cyan-500/40">
            <UploadCloud size={28} className="group-hover:animate-bounce" />
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
            className="group relative overflow-hidden rounded-[1.5rem] bg-[var(--button-primary-bg)] px-8 py-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-10 shadow-2xl cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--button-primary-text)] group-hover:text-white transition-colors">
              Spustit Audit <Zap size={14} className="fill-current" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
