import { useState, useEffect, useCallback } from "react";
import { AnalysisResult, HistoryItem, ServerActionResponse } from "@/types";
import { analyzeContract } from "@/app/analysis/actions";

export const useAnalysis = () => {
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [displayUspora, setDisplayUspora] = useState(0);
  const [usporaAnimationSeed, setUsporaAnimationSeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [tempFileName, setTempFileName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedData = localStorage.getItem("analysis_entry_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAnalysis(parsed);
        setUploadedFileName(parsed.fileName || "Záznam z historie");
        localStorage.removeItem("analysis_entry_data");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        console.error("Chyba při parsování dat z historie:", e);
      }
    }
  }, []);

  useEffect(() => {
    const target = analysis ? (Number(analysis.uspora) || 0) : 0;
    if (target <= 0) return;

    setDisplayUspora(0);
    const startValue = 0;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayUspora(startValue + (target - startValue) * easeOutExpo);
      if (frame >= totalFrames) {
        setDisplayUspora(target);
        clearInterval(timer);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [analysis, usporaAnimationSeed]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (loading) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 30) return prev + 0.8; 
          if (prev < 70) return prev + 0.4;
          if (prev < 90) return prev + 0.2;
          if (prev < 98) return prev + 0.05;
          return prev;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleRenameFile = (newName: string) => {
    setUploadedFileName(newName);
    setIsEditingFileName(false);
    setAnalysis((prev) => (prev ? { ...prev, fileName: newName } : prev));
    if (typeof window !== 'undefined') {
      try {
        const targetId = analysis?.id ? String(analysis.id) : null;
        const raw = localStorage.getItem("finance_history");
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        const savedHistory = (Array.isArray(parsed) ? parsed : []) as HistoryItem[];
        const updatedHistory = targetId
          ? savedHistory.map((item) =>
              String(item.id) === targetId ? { ...item, fileName: newName } : item,
            )
          : savedHistory;
        localStorage.setItem("finance_history", JSON.stringify(updatedHistory as HistoryItem[]));
      } catch (e) {
        console.error("Chyba při ukládání přejmenování souboru do localStorage:", e);
      }
    }
  };

  const handleProcess = async (formData: FormData, fileName: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setDisplayUspora(0);
    setUploadedFileName(fileName);
    
    try {
      const result: ServerActionResponse<AnalysisResult> = await analyzeContract(formData);
      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result && result.data) {
        setLoadingProgress(100);
        const serverData = result.data as AnalysisResult;
        const resultWithMeta: AnalysisResult = { 
          ...serverData,
          fileName: fileName,
          id: String(serverData.id || `anl-${Date.now()}`),
          date: String(new Date().toLocaleDateString('cs-CZ'))
        };

        setTimeout(() => {
          setAnalysis(resultWithMeta);
          setLoading(false);
          const history = JSON.parse(localStorage.getItem("finance_history") || "[]");
          localStorage.setItem("finance_history", JSON.stringify([resultWithMeta, ...history.slice(0, 9)]));
        }, 600);
      }
    } catch (_err) {
      setError("Nepodařilo se spojit s analytickou AI.");
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setContractText("");
    setUploadedFileName(null);
    setDisplayUspora(0);
    setLoadingProgress(0);
  };

  const restartUsporaAnimation = useCallback(() => {
    setUsporaAnimationSeed((v) => v + 1);
  }, []);

  return {
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
    resetAnalysis,
    restartUsporaAnimation
  };
};
