import { useState, useEffect, useCallback } from "react";
import { AnalysisResult, HistoryItem, ServerActionResponse } from "@/types";
import { analyzeContract } from "@/app/(app)/analysis/actions";
import { useUser } from "@/app/components/UserContext";
import { useHistory } from "./useHistory";

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
  const [showRetry, setShowRetry] = useState(false);

  // Duplicate name state
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [pendingOriginalName, setPendingOriginalName] = useState("");
  const [suggestedName, setSuggestedName] = useState("");

  const { user } = useUser();
  const { history, addEntry, renameEntry } = useHistory();

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
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (loading) {
      setLoadingProgress(0);
      setShowRetry(false);
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const next = prev < 30 ? prev + 0.8 :
                       prev < 70 ? prev + 0.4 :
                       prev < 90 ? prev + 0.2 :
                       prev < 98 ? prev + 0.05 : prev;
          
          // Start timer when we reach 98%
          if (next >= 98 && !timeout) {
            timeout = setTimeout(() => {
              setShowRetry(true);
            }, 5000);
          }
          return next;
        });
      }, 50);
    } else {
      if (timeout) clearTimeout(timeout);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [loading]);

  const handleRenameFile = async (newName: string) => {
    if (!analysis?.id) return;
    
    // Check for duplicates in database history
    const nameExists = history.some(item => 
      item.fileName === newName && String(item.id) !== String(analysis.id)
    );

    let finalName = newName;
    if (nameExists) {
      let counter = 1;
      while (history.some(item => 
        item.fileName === `${newName} (${counter})` && String(item.id) !== String(analysis.id)
      )) {
        counter++;
      }
      finalName = `${newName} (${counter})`;
    }

    setUploadedFileName(finalName);
    setIsEditingFileName(false);
    setAnalysis((prev) => (prev ? { ...prev, fileName: finalName } : prev));
    
    await renameEntry(String(analysis.id), finalName);
  };

  const processAnalysis = async (formData: FormData, fileName: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setDisplayUspora(0);
    setUploadedFileName(fileName);
    
    try {
      const userData = user ? {
        email: user.email || undefined,
        name: user.name || undefined,
        phone: user.phone || undefined
      } : undefined;

      const result: ServerActionResponse<AnalysisResult> = await analyzeContract(formData, userData);
      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result && result.data) {
        setLoadingProgress(100);
        const serverData = result.data as AnalysisResult;
        const resultWithMeta: AnalysisResult = { 
          ...serverData,
          fileName: fileName,
          date: String(new Date().toLocaleDateString('cs-CZ')),
          timestamp: new Date().toISOString()
        };

        setTimeout(async () => {
          // Save to database FIRST
          const savedEntry = await addEntry(resultWithMeta);
          
          // Update analysis with the ID from DB if available
          const finalAnalysis = savedEntry?.id 
            ? { ...resultWithMeta, id: String(savedEntry.id) } 
            : resultWithMeta;

          setAnalysis(finalAnalysis);
          setLoading(false);
        }, 600);
      }
    } catch (_err) {
      setError("Nepodařilo se spojit s analytickou AI.");
      setLoading(false);
    }
  };

  const handleProcess = async (formData: FormData, fileName: string) => {
    // Check for duplicates in database history
    const nameExists = history.some(item => item.fileName === fileName);
    
    if (nameExists) {
      setPendingFormData(formData);
      setPendingOriginalName(fileName);
      
      let counter = 1;
      while (history.some(item => item.fileName === `${fileName} (${counter})`)) {
        counter++;
      }
      setSuggestedName(`${fileName} (${counter})`);
      setIsDuplicateModalOpen(true);
      return;
    }

    await processAnalysis(formData, fileName);
  };

  const confirmRename = async (newName: string) => {
    if (pendingFormData && pendingOriginalName) {
      setIsDuplicateModalOpen(false);
      await processAnalysis(pendingFormData, newName);
      setPendingFormData(null);
      setPendingOriginalName("");
    }
  };

  const cancelRename = () => {
    setIsDuplicateModalOpen(false);
    setPendingFormData(null);
    setPendingOriginalName("");
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setContractText("");
    setUploadedFileName(null);
    setDisplayUspora(0);
    setLoadingProgress(0);
    setLoading(false);
    setShowRetry(false);
    setError(null);
  };

  const handleRetry = () => {
    if (uploadedFileName) {
      // Pokud máme soubor, zkusíme ho znovu procesovat
      const formData = new FormData();
      // Poznámka: V reálné appce bychom museli mít soubor uložený v refu, 
      // zde simulujeme restart s původním názvem
      handleProcess(formData, uploadedFileName);
    } else if (contractText) {
      // Pokud máme text, zkusíme ho znovu
      const formData = new FormData();
      formData.append("text", contractText);
      handleProcess(formData, "Manuální vstup textu");
    }
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
    showRetry,
    handleRetry,
    handleRenameFile,
    handleProcess,
    resetAnalysis,
    restartUsporaAnimation,
    // Duplicate Modal Props
    isDuplicateModalOpen,
    pendingOriginalName,
    suggestedName,
    confirmRename,
    cancelRename
  };
};
