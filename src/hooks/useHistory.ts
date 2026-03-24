// src/hooks/useHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '@/types';
import { sanitizeHistoryNames } from '@/utils/history';

const STORAGE_KEY = "finance_history";

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Načtení a sanace historie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? (JSON.parse(saved) as unknown) : [];
        const parsedArray = Array.isArray(parsed) ? parsed : [];
        
        // Validace a přidání ID pokud chybí
        const validated: HistoryItem[] = parsedArray.map((raw, index) => {
          const item =
            (typeof raw === "object" && raw !== null ? raw : {}) as Partial<HistoryItem>;
          return {
            ...item,
            id: String(item.id || `id-${index}-${Date.now()}`),
          } as HistoryItem;
        });

        // SANACE: Oprava duplicitních názvů v celé historii
        const { sanitized, changed } = sanitizeHistoryNames(validated);
        
        if (changed) {
          console.log("History sanitized: fixed duplicate filenames.");
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          setHistory(sanitized);
        } else {
          setHistory(validated);
        }
      } catch (e) {
        console.error("Chyba při načítání historie:", e);
        setHistory([]);
      }
      setIsLoaded(true);
    }
  }, []);

  // Uložení historie
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    }
  }, []);

  // Přidání záznamu
  const addEntry = useCallback((entry: HistoryItem) => {
    const newHistory = [entry, ...history];
    saveHistory(newHistory);
  }, [history, saveHistory]);

  // Smazání záznamů podle ID
  const deleteEntries = useCallback((idsToDelete: string[]) => {
    const newHistory = history.filter(item => !idsToDelete.includes(String(item.id)));
    saveHistory(newHistory);
  }, [history, saveHistory]);

  // Přejmenování záznamu
  const renameEntry = useCallback((id: string, newName: string) => {
    const newHistory = history.map(item => 
      String(item.id) === id ? { ...item, fileName: newName } : item
    );
    saveHistory(newHistory);
  }, [history, saveHistory]);

  return {
    history,
    isLoaded,
    addEntry,
    deleteEntries,
    renameEntry,
    setHistory: saveHistory
  };
};
