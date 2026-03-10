"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeContract } from "./actions";
import { FileText, Zap, ShieldCheck, ArrowRight, UploadCloud, File } from "lucide-react";

type UploadSectionProps = {
  text: string;
  onTextChange: (value: string) => void;
  onAnalyze: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  fileName: string | null;
};

function UploadSection({
  text,
  onTextChange,
  onAnalyze,
  onFileChange,
  loading,
  fileName,
}: UploadSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        Vstupní dokumenty
      </h2>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <label
          htmlFor="pdf-upload"
          className="group flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition-transform group-hover:scale-110">
            {fileName ? <File size={20} /> : <UploadCloud size={20} />}
          </div>
          <p className="mb-1 text-sm font-bold text-slate-900">
            {fileName ? fileName : "Přetáhněte PDF smlouvy"}
          </p>
          <p className="mb-3 text-xs text-slate-500">
            {fileName ? "Klikněte pro změnu souboru" : "nebo klikněte pro výběr souboru"}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Zabezpečené zpracování
          </div>
          <input 
            id="pdf-upload" 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            onChange={onFileChange}
            disabled={loading}
          />
        </label>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Nebo vložte text
          </p>
          <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <textarea
              placeholder="Vložte sem text smlouvy (Ctrl+V)…"
              value={text}
              onChange={(event) => onTextChange(event.target.value)}
              className="min-h-[140px] w-full flex-1 resize-none border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-[10px] text-slate-400 font-medium">AI analýza v češtině</span>
              <button
                type="button"
                onClick={onAnalyze}
                disabled={loading || !text.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-30 active:scale-95"
              >
                {loading ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : <Zap size={14} />}
                {loading ? "Analyzuji…" : "Spustit analýzu"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({
  title,
  highlight,
  description,
  badge,
  icon: Icon
}: any) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
          <Icon size={18} className="text-slate-400 group-hover:text-blue-600" />
        </div>
        {badge && (
          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</h3>
        <p className="text-sm font-black text-slate-900 mb-2 leading-tight">{highlight}</p>
        <p className="text-[11px] leading-relaxed text-slate-500">{description}</p>
      </div>
    </article>
  );
}

export default function AnalysisPage() {
  const router = useRouter();
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Pomocná funkce pro uložení do historie
  const saveToHistory = (data: any, name: string) => {
    try {
      const historyEntry = {
        id: Date.now(),
        date: new Date().toLocaleString("cs-CZ"),
        fileName: name,
        ...data
      };
      
      const existingHistory = JSON.parse(localStorage.getItem("finance_history") || "[]");
      const updatedHistory = [historyEntry, ...existingHistory];
      localStorage.setItem("finance_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("Nepodařilo se uložit do historie:", err);
    }
  };

  // Funkce pro analýzu vkládaného textu
  const handleAnalyzeText = async () => {
    if (!contractText.trim()) return;
    
    setLoading(true);
    setError(null);
    setUploadedFileName(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("text", contractText);

      const result: any = await analyzeContract(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      
      setAnalysis(result);
      saveToHistory(result, "Vložený text");
    } catch {
      setError("Něco se pokazilo při analýze textu.");
    } finally {
      setLoading(false);
    }
  };

  // Funkce pro nahrání a analýzu PDF souboru
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setContractText(""); 
    setUploadedFileName(file.name);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result: any = await analyzeContract(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      
      setAnalysis(result);
      saveToHistory(result, file.name);
    } catch (err) {
      setError("Nepodařilo se nahrát nebo zpracovat PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
          Smart Analysis
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Analýza finančních smluv
        </h1>
      </header>

      <div className="space-y-8">
        <UploadSection
          text={contractText}
          onTextChange={setContractText}
          onAnalyze={handleAnalyzeText}
          onFileChange={handleFileChange}
          loading={loading}
          fileName={uploadedFileName}
        />

        {error && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-100">
            {error}
          </div>
        )}

        {analysis && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Výsledky analýzy
              </h2>
              <button 
                onClick={() => router.push(`/consultation?uspora=${analysis.uspora}&fixace=${analysis.fixace}`)}
                className="group flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Probrat výsledky s AI bankéřem
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <RecommendationCard
                icon={FileText}
                title="Fixace hypotéky"
                highlight={analysis.fixace}
                description="Konec fixace je kritický moment pro vyjednání lepších podmínek."
                badge="Klíčový údaj"
              />
              <RecommendationCard
                icon={Zap}
                title="Potenciál úspory"
                highlight={`${analysis.uspora} Kč / měsíčně`}
                description="Odhadovaná částka, kterou můžete ušetřit při aktuálních sazbách."
                badge="Příležitost"
              />
              <RecommendationCard
                icon={ShieldCheck}
                title="Stav pojištění"
                highlight={analysis.pojisteni}
                description="Prověřujeme, zda vaše krytí odpovídá aktuální tržní ceně."
                badge="Bezpečnost"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}