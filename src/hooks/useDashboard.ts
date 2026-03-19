import { useState, useEffect } from "react";
import { HistoryItem } from "@/types";
import { useAppNavigation } from "./useAppNavigation";

export const useDashboard = () => {
  const { goToAnalysis, goToHistory, goToConsultation } = useAppNavigation();
  const [lastAnalysis, setLastAnalysis] = useState<HistoryItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem("finance_history");
        const saved = raw ? JSON.parse(raw) : [];
        if (Array.isArray(saved) && saved.length > 0) {
          setLastAnalysis(saved[0]);
        }
      } catch (e) {
        console.error("Chyba při načítání finance_history:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleConsultation = () => {
    if (lastAnalysis) {
      goToConsultation(lastAnalysis);
    } else {
      goToAnalysis();
    }
  };

  const handleHistory = () => {
    goToHistory(lastAnalysis?.id);
  };

  const handleAnalysis = () => {
    goToAnalysis();
  };

  return {
    lastAnalysis,
    isLoaded,
    goToConsultation: handleConsultation,
    goToHistory: handleHistory,
    goToAnalysis: handleAnalysis
  };
};
