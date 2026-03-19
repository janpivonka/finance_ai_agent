"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ScrollToTop } from "../components/ScrollToTop";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useHistoryPage } from "@/hooks/useHistoryPage";
import { HistoryItem } from "@/types";

import { HistoryList } from "../components/history/HistoryList";
import { HistoryEmptyState } from "../components/history/HistoryEmptyState";
import { HistoryDeleteModal } from "../components/history/HistoryDeleteModal";
import { HistoryDetailModal } from "../components/history/HistoryDetailModal";

// Shared UI Components
import { PageBackground } from "../components/ui/PageBackground";
import { PageHeader } from "../components/ui/PageHeader";
import { History as HistoryIcon, Search, X, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import { SortField } from "@/types";

export default function HistoryPage() {
  const router = useRouter();
  const {
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
  } = useHistoryPage();

  useScrollDirection();
  
  // Intersection observer for title reveal
  useIntersectionObserver('.reveal', isLoaded ? filteredAndSortedHistory.length : -1);

  const handleReturnToAnalysis = (item: HistoryItem) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("analysis_entry_data", JSON.stringify(item));
      } catch (e) { 
        console.error("Chyba při ukládání dat pro návrat na analýzu:", e); 
      }
    }
    router.push('/analysis');
  };

  const handleConsultation = (item: HistoryItem) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("last_analysis_data", JSON.stringify({ id: item.id }));
      } catch (e) { 
        console.error(e); 
      }
    }
    router.push(`/consultation?id=${encodeURIComponent(String(item.id))}&uspora=${encodeURIComponent(String(item.uspora))}&fixace=${encodeURIComponent(String(item.fixace))}`);
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto max-w-4xl px-6 py-12 relative">
        <PageBackground 
          glows={[
            { position: "top-left", color: "bg-indigo-600", size: "w-full h-96", opacity: "opacity-10", animate: true }
          ]}
        />

        <PageHeader 
          badgeIcon={HistoryIcon}
          badgeText="Data Archive Protocol"
          revealType="on-scroll"
          title={
            <>
              Moje <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-text not-italic">Historie</span>
            </>
          }
          description="Kompletní přehled vašich finančních analýz. Data jsou ukládána lokálně a synchronizována pro okamžitý přístup."
          rightElement={
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="relative flex-1 group min-w-[300px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Hledat v archivu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500/40 backdrop-blur-xl transition-all"
                />
                {searchQuery && (
                  <X 
                    size={16} 
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer" 
                  />
                )}
              </div>

              <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
                {(['date', 'uspora', 'name'] as SortField[]).map((field) => {
                  const isActive = sortBy === field;
                  return (
                    <button
                      key={field}
                      onClick={() => handleSort(field)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        isActive 
                        ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' 
                        : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {field === 'date' ? 'Datum' : field === 'uspora' ? 'Úspora' : 'Název'}
                      {isActive && (
                        sortOrder === 'asc' ? <ArrowUpNarrowWide size={14} /> : <ArrowDownWideNarrow size={14} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          }
        />
        
        <AnimatePresence mode="wait">
          {filteredAndSortedHistory.length === 0 ? (
            <HistoryEmptyState searchQuery={searchQuery} />
          ) : (
            <HistoryList
              items={filteredAndSortedHistory}
              selectedIds={selectedIds}
              highlightedId={highlightedId}
              sortBy={sortBy}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onClearSelection={() => setSelectedIds([])}
              onBulkDelete={() => setIsBulkDelete(true)}
              onEntryClick={(item) => setSelectedEntry(item)}
              onDeleteClick={(id) => setDeleteId(id)}
              itemsRef={itemsRef}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!!(deleteId || isBulkDelete) && (
            <HistoryDeleteModal
              isBulk={isBulkDelete}
              selectedCount={selectedIds.length}
              onClose={closeModal}
              onConfirm={confirmDelete}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedEntry && (
            <HistoryDetailModal
              item={selectedEntry}
              isEditingName={isEditingName}
              tempName={tempName}
              onClose={closeModal}
              onRename={handleRename}
              onEditToggle={setIsEditingName}
              onTempNameChange={setTempName}
              onReturnToAnalysis={handleReturnToAnalysis}
              onConsultation={handleConsultation}
            />
          )}
        </AnimatePresence>
      </div>

      <ScrollToTop forceShow={!selectedEntry && !deleteId} />
    </div>
  );
}
