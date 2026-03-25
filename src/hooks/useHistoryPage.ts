import { useState, useEffect, useRef, useMemo } from "react";
import { HistoryItem, SortField, SortOrder } from "@/types";
import { useHistory } from "./useHistory";

export const useHistoryPage = () => {
  const { 
    history, 
    isLoaded, 
    deleteEntries, 
    renameEntry 
  } = useHistory();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [selectedEntry, setSelectedEntry] = useState<HistoryItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const itemsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const pendingScrollIdRef = useRef<string | null>(null);
  const pendingHighlightIdRef = useRef<string | null>(null);
  const highlightStartTimeoutRef = useRef<number | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const last = localStorage.getItem("last_analysis_data");
      if (last) {
        const parsed = JSON.parse(last);
        const idToHighlight = parsed?.id ? String(parsed.id) : null;
        if (idToHighlight) {
          pendingScrollIdRef.current = idToHighlight;
          pendingHighlightIdRef.current = idToHighlight;
        }
        localStorage.removeItem("last_analysis_data");
      }
    } catch (e) {
      console.error("Chyba last_analysis_data:", e);
    }
  }, []);

  const filteredAndSortedHistory = useMemo(() => {
    // Pomocná funkce pro normalizaci textu (odstranění diakritiky)
    const normalize = (text: string) => 
      text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const s = normalize(searchQuery);

    return history
      .filter((item) => {
        if (!s) return true;
        
        const fileName = normalize(item?.fileName || "");
        const date = normalize(item?.date || "");
        const uspora = normalize(String(item?.uspora || ""));
        
        return (
          fileName.includes(s) ||
          date.includes(s) ||
          uspora.includes(s)
        );
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "uspora") {
          comparison = Number(a.uspora || 0) - Number(b.uspora || 0);
        } else if (sortBy === "name") {
          comparison = (a.fileName || "").localeCompare(b.fileName || "", 'cs', { sensitivity: 'base' });
        } else if (sortBy === "date") {
          // Sort by timestamp if available, otherwise fallback to parsing date or using id
          const timeA = a.timestamp ? new Date(a.timestamp).getTime() : (a.id.startsWith('anl-') ? parseInt(a.id.split('-')[1]) : 0);
          const timeB = b.timestamp ? new Date(b.timestamp).getTime() : (b.id.startsWith('anl-') ? parseInt(b.id.split('-')[1]) : 0);
          
          if (timeA !== timeB && !isNaN(timeA) && !isNaN(timeB)) {
            comparison = timeA - timeB;
          } else {
            // Fallback na textové porovnání ID
            comparison = (a.id || "").toString().localeCompare((b.id || "").toString());
          }
        } else {
          comparison = (a.id || "").toString().localeCompare((b.id || "").toString());
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [history, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    if (!isLoaded) return;
    const idToScroll = pendingScrollIdRef.current;
    if (!idToScroll) return;

    const el = itemsRef.current[idToScroll];
    if (el) {
      const timer = setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        
        const highlightId = pendingHighlightIdRef.current || idToScroll;

        if (highlightStartTimeoutRef.current) window.clearTimeout(highlightStartTimeoutRef.current);
        if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current);

        highlightStartTimeoutRef.current = window.setTimeout(() => {
          setHighlightedId(highlightId);
          highlightTimeoutRef.current = window.setTimeout(() => {
            setHighlightedId((current) => current === highlightId ? null : current);
          }, 2500);
        }, 500);
        
        pendingScrollIdRef.current = null;
        pendingHighlightIdRef.current = null;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, history.length]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  const handleRename = (id: string, newName: string) => {
    renameEntry(id, newName);
    setIsEditingName(false);
    if (selectedEntry && String(selectedEntry.id) === id) {
      setSelectedEntry({ ...selectedEntry, fileName: newName });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedHistory.map(item => String(item.id)));
    }
  };

  const confirmDelete = () => {
    if (deleteId || isBulkDelete) {
      const idsToDelete = isBulkDelete ? [...selectedIds] : [String(deleteId)];
      
      // Synchronizovaný update stavů pro plynulou animaci
      setTimeout(() => {
        // 1. Odstraníme záznamy z historie
        deleteEntries(idsToDelete);
        
        // 2. Pokud byl smazán detail, zavřeme ho
        if (selectedEntry && idsToDelete.includes(String(selectedEntry.id))) {
          setSelectedEntry(null);
        }

        // 3. Aktualizujeme vybrané položky - pokud mažeme individuální položku, která byla v multiselectu, 
        // odstraníme ji i odtud. Pokud mažeme přes multiselect, vyčistíme vše.
        if (isBulkDelete) {
          setSelectedIds([]);
        } else {
          setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
        }
        
        // 4. Vyčistíme stavy modalů
        setDeleteId(null);
        setIsBulkDelete(false);
      }, 400);
    }
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setDeleteId(null);
    setIsBulkDelete(false);
    setIsEditingName(false);
  };

  return {
    history,
    isLoaded,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortOrder,
    filteredAndSortedHistory,
    selectedEntry,
    setSelectedEntry,
    selectedIds,
    setSelectedIds,
    deleteId,
    setDeleteId,
    isBulkDelete,
    setIsBulkDelete,
    highlightedId,
    isEditingName,
    setIsEditingName,
    tempName,
    setTempName,
    mounted,
    itemsRef,
    handleSort,
    handleRename,
    toggleSelect,
    toggleSelectAll,
    confirmDelete,
    closeModal
  };
};
