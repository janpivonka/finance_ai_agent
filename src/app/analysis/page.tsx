"use client";

import React from "react";
import { ScrollToTop } from "../components/ScrollToTop";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

// Import modular components
import { AnalysisHeader } from "../components/analysis/AnalysisHeader";
import { AnalysisBackground } from "../components/analysis/AnalysisBackground";
import { AnalysisUpload } from "../components/analysis/AnalysisUpload";
import { AnalysisLoading } from "../components/analysis/AnalysisLoading";
import { AnalysisError } from "../components/analysis/AnalysisError";
import { AnalysisResults } from "../components/analysis/AnalysisResults";

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
  useIntersectionObserver('.reveal', analysis ? 1 : 0);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 transition-all duration-1000 pb-24 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-8 h-full flex flex-col relative py-8 md:px-12">
        
        <AnalysisBackground />

        <AnalysisHeader 
          analysis={analysis} 
          loading={loading} 
          onReset={resetAnalysis} 
        />

        <div className={`relative z-10 flex-1 flex flex-col gap-4 transition-all duration-700 ${!analysis ? "justify-center" : ""}`}>
          
          {error && !loading && (
            <AnalysisError error={error} onClear={() => setError(null)} />
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
      
      <style jsx global>{`
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulse-gentle { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.01); opacity: 0.98; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.05); } }
        @keyframes reveal-css { from { opacity: 0; transform: translateY(20px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        
        .reveal-header { animation: reveal-css 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-init { animation: reveal-css 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        
        .animate-gradient-text { animation: gradient-text 5s ease infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        
        ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
      `}</style>
    </div>
  );
}
