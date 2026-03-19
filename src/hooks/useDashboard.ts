import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HistoryItem } from "@/types";

export const useDashboard = () => {
  const router = useRouter();
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

  const goToConsultation = () => {
    if (lastAnalysis) {
      const idParam = encodeURIComponent(String(lastAnalysis.id || ""));
      const usporaParam = encodeURIComponent(String(lastAnalysis.uspora));
      const fixaceParam = encodeURIComponent(String(lastAnalysis.fixace));
      router.push(
        `/consultation?id=${idParam}&uspora=${usporaParam}&fixace=${fixaceParam}`,
      );
    } else {
      router.push('/analysis');
    }
  };

  const goToHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        if (lastAnalysis?.id) {
          localStorage.setItem(
            "last_analysis_data",
            JSON.stringify({ id: lastAnalysis.id }),
          );
        }
      } catch (e) {
        console.error(
          "Nepodařilo se uložit last_analysis_data pro historii z dashboardu:",
          e,
        );
      }
    }
    router.push("/history");
  };

  const goToAnalysis = () => {
    router.push('/analysis');
  };

  return {
    lastAnalysis,
    isLoaded,
    goToConsultation,
    goToHistory,
    goToAnalysis
  };
};
