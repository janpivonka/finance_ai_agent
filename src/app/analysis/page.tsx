"use client";

import React from "react";
import { ScrollToTop } from "../components/ScrollToTop";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

import { AnalysisUpload } from "../components/analysis/AnalysisUpload";
import { AnalysisLoading } from "../components/analysis/AnalysisLoading";
import { AnalysisResults } from "../components/analysis/AnalysisResults";

// Shared UI Components
import { PageBackground } from "../components/ui/PageBackground";
import { PageHeader } from "../components/ui/PageHeader";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Activity, RotateCcw } from "lucide-react";

export default function AnalysisPage() {
  const {
    contractText,
    setContractText,
    loading,
    loadingProgress,
    analysis,
    displayUspora,
    error,
    setError,
    uploadedFileName,
    isEditingFileName,
    setIsEditingFileName,
    tempFileName,
    setTempFileName,
    mounted,
    handleRenameFile,
    handleProcess,
    resetAnalysis
  } = useAnalysis();

  useScrollDirection();
  useIntersectionObserver('.reveal', `${mounted}-${analysis ? 1 : 0}`);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 transition-all duration-1000 pb-24 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-8 h-full flex flex-col relative py-8 md:px-12">
        
        <PageBackground 
          glows={[
            { position: "top-left", color: "bg-indigo-600", size: "w-96 h-96", opacity: "opacity-10", animate: true },
            { position: "bottom-right", color: "bg-cyan-600", size: "w-96 h-96", opacity: "opacity-5", animate: true, delay: "2s" }
          ]}
        />

        <PageHeader 
          badgeIcon={Activity}
          badgeText="AI Analytics Protocol v3"
          title={
            <>
              Analýza{" "}
              <span className="inline-block align-baseline pb-1 pr-1 animate-gradient-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent italic">
                Potenciálu
              </span>
            </>
          }
          description={!analysis && !loading ? "Nahrajte dokument pro hloubkovou kontrolu skrytých poplatků a identifikaci úsporných příležitostí v reálném čase." : undefined}
          rightElement={analysis && (
            <button 
              onClick={resetAnalysis}
              className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-pointer"
            >
              <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
              Další instrument
            </button>
          )}
        />

        <div className={`relative z-10 flex-1 flex flex-col gap-4 transition-all duration-700 ${!analysis ? "justify-center" : ""}`}>
          
          {error && !loading && (
            <ErrorMessage error={error} onClear={() => setError(null)} />
          )}

          {!analysis && !loading && (
            <AnalysisUpload 
              contractText={contractText}
              onTextChange={setContractText}
              onProcess={handleProcess}
              loading={loading}
            />
          )}

          {loading && (
            <AnalysisLoading progress={loadingProgress} />
          )}

          {analysis && !loading && (
            <AnalysisResults 
              analysis={analysis}
              displayUspora={displayUspora}
              uploadedFileName={uploadedFileName}
              isEditingFileName={isEditingFileName}
              setIsEditingFileName={setIsEditingFileName}
              tempFileName={tempFileName}
              setTempFileName={setTempFileName}
              handleRenameFile={handleRenameFile}
            />
          )}
        </div>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
