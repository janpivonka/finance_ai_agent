// src/hooks/useHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '@/types';
import { useUser } from '@/app/components/UserContext';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isLoading: isUserLoading, refreshUser } = useUser();

  const loadHistory = useCallback(async () => {
    // Nejdříve zkusíme načíst z localStorage pro okamžitou odezvu
    if (typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem("finance_history");
        if (localData) {
          setHistory(JSON.parse(localData));
        }
      } catch (e) {
        console.error("Chyba při načítání z localStorage:", e);
      }
    }

    if (!user?.id) {
      if (!isUserLoading) setIsLoaded(true);
      return;
    }
    
    try {
      const res = await fetch(`/api/history?userId=${user.id}&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        // Synchronizujeme localStorage s daty ze serveru
        localStorage.setItem("finance_history", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Chyba při načítání historie:", e);
    } finally {
      setIsLoaded(true);
    }
  }, [user?.id, isUserLoading]);

  useEffect(() => {
    if (!isUserLoading) {
      loadHistory();
    }
  }, [user?.id, isUserLoading, loadHistory]);

  const addEntry = useCallback(async (entry: HistoryItem) => {
    if (!user?.id) return null;

    try {
      // 1. Lokální update pro okamžitou odezvu
      const updatedHistory = [entry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("finance_history", JSON.stringify(updatedHistory));

      // 2. Serverový update
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, userId: user.id })
      });
      
      if (res.ok) {
        const newEntry = await res.json();
        // Nahradíme dočasný záznam finálním ze serveru (může mít jiné ID/metadata)
        setHistory(prev => {
          const filtered = prev.filter(item => item.id !== entry.id);
          const final = [newEntry, ...filtered];
          localStorage.setItem("finance_history", JSON.stringify(final));
          return final;
        });
        
        // Refreshneme data uživatele, aby se aktualizoval totalAnalyses counter
        await refreshUser();
        
        return newEntry;
      }
    } catch (e) {
      console.error("Chyba při ukládání do historie:", e);
    }
    return null;
  }, [user?.id, history]);

  const deleteEntries = useCallback(async (idsToDelete: string[]) => {
    if (!user?.id) return;

    try {
      // Pro jednoduchost smažeme v DB a pak v lokálním stavu
      await Promise.all(idsToDelete.map(id => 
        fetch(`/api/history/${id}`, { method: 'DELETE' })
      ));
      setHistory(prev => prev.filter(item => !idsToDelete.includes(String(item.id))));
    } catch (e) {
      console.error("Chyba při mazání z historie:", e);
    }
  }, [user?.id]);

  const renameEntry = useCallback(async (id: string, newName: string) => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: newName })
      });
      if (res.ok) {
        setHistory(prev => prev.map(item => 
          String(item.id) === id ? { ...item, fileName: newName } : item
        ));
      }
    } catch (e) {
      console.error("Chyba při přejmenování v historii:", e);
    }
  }, [user?.id]);

  return {
    history,
    isLoaded,
    addEntry,
    deleteEntries,
    renameEntry,
    setHistory
  };
};
