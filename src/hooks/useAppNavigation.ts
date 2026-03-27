import { useRouter } from "next/navigation";
import { HistoryItem } from "@/types";

/**
 * Centrální hook pro navigaci v aplikaci se zachováním kontextu (localStorage).
 * Sjednocuje logiku přechodů mezi stránkami Dashboard, Analýza, Historie a Konzultace.
 */
export const useAppNavigation = () => {
  const router = useRouter();

  const safeSetItem = (key: string, value: unknown) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Chyba při ukládání do localStorage (${key}):`, e);
      }
    }
  };

  /**
   * Navigace na stránku Analýzy
   * @param item Volitelný záznam z historie pro opětovné načtení do formuláře
   */
  const goToAnalysis = (item?: HistoryItem) => {
    if (item) {
      safeSetItem("analysis_entry_data", item);
    }
    router.push("/analysis");
  };

  /**
   * Navigace na stránku Historie
   * @param highlightId Volitelné ID položky, která se má po načtení zvýraznit a ke které se má odscrollovat
   */
  const goToHistory = (highlightId?: string | number) => {
    if (highlightId) {
      safeSetItem("last_analysis_data", { id: highlightId });
    }
    router.push("/history");
  };

  /**
   * Navigace na stránku Konzultace
   * @param item Záznam z historie, pro který se má konzultace zahájit
   */
  const goToConsultation = (
    item?: Pick<HistoryItem, "id" | "uspora" | "fixace">,
  ) => {
    if (!item) {
      router.push("/consultation");
      return;
    }

    const idParam = encodeURIComponent(String(item.id ?? ""));
    const usporaParam = encodeURIComponent(String(item.uspora ?? 0));
    const fixaceParam = encodeURIComponent(String(item.fixace ?? ""));

    if (item.id) safeSetItem("last_analysis_data", { id: item.id });

    router.push(
      `/consultation?id=${idParam}&uspora=${usporaParam}&fixace=${fixaceParam}`,
    );
  };

  /**
   * Navigace na Dashboard
   */
  const goToDashboard = () => {
    router.push("/dashboard");
  };

  /**
   * Návrat na domovskou stránku (Landing page)
   */
  const goToHome = () => {
    router.push("/");
  };

  /**
   * Odhlášení a návrat na domovskou stránku
   */
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("finance_auth_session");
    }
    router.push("/");
  };

  return {
    goToAnalysis,
    goToHistory,
    goToConsultation,
    goToDashboard,
    goToHome,
    logout,
  };
};
