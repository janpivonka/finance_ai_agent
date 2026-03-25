"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { ScrollToTop } from "../../components/ScrollToTop";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useHistoryPage } from "@/hooks/useHistoryPage";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";
import { HistoryItem } from "@/types";

import { HistoryList } from "../../components/history/HistoryList";
import { HistoryEmptyState } from "../../components/history/HistoryEmptyState";
import { HistoryDeleteModal } from "../../components/history/HistoryDeleteModal";
import { HistoryDetailModal } from "../../components/history/HistoryDetailModal";

// Shared UI Components
import { PageBackground } from "../../components/ui/PageBackground";
import { PageHeader } from "../../components/ui/PageHeader";
import { History as HistoryIcon, Search, X, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import { SortField } from "@/types";

export default function HistoryPage() {
  const { goToAnalysis, goToConsultation } = useAppNavigation();
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

  const { activeId, handleInteraction } = useMobileInteraction();

  useScrollDirection();
  
  const handleReturnToAnalysis = (item: HistoryItem) => {
    goToAnalysis(item);
  };

  const handleConsultation = (item: HistoryItem) => {
    goToConsultation(item);
  };

  if (!mounted) return <div className="min-h-screen bg-[var(--background)]" />;

  return (
    <div className={`min-h-screen bg-[var(--background)] text-[color:var(--foreground)] selection:bg-indigo-500/30 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto max-w-4xl px-6 py-12 relative">
        <PageBackground 
          glows={[
            { position: "top-left", color: "bg-indigo-600", size: "w-full h-96", opacity: "opacity-10", animate: true }
          ]}
        />

        <PageHeader 
          badgeIcon={HistoryIcon}
          badgeText="Data Archive Protocol"
          revealType="on-load"
          title={
            <>
              Moje <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-text not-italic">Historie</span>
            </>
          }
          description="Kompletní přehled vašich finančních analýz. Data jsou ukládána lokálně a synchronizována pro okamžitý přístup."
          rightElement={
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="relative flex-1 group min-w-[300px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] group-focus-within:text-cyan-400 transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Hledat v archivu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--panel)] border border-[color:var(--panel-border)] rounded-2xl py-4 pl-12 pr-10 text-xs text-[color:var(--foreground)] outline-none focus:ring-1 focus:ring-indigo-500/40 backdrop-blur-xl transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {[
                  { field: 'date', label: 'Datum', icon: HistoryIcon },
                  { field: 'name', label: 'Název', icon: HistoryIcon },
                  { field: 'uspora', label: 'Úspora', icon: HistoryIcon }
                ].map((f) => (
                  <button
                    key={f.field}
                    onClick={() => handleSort(f.field as SortField)}
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-xl shadow-lg ring-1 cursor-pointer whitespace-nowrap ${
                      sortBy === f.field 
                        ? 'bg-indigo-600 text-white ring-white/20' 
                        : 'bg-[var(--panel)] text-[color:var(--muted)] border border-[color:var(--panel-border)] hover:bg-[var(--panel-strong)] ring-[color:var(--panel-border)]'
                    }`}
                  >
                    {sortBy === f.field && (
                      sortOrder === 'asc' ? <ArrowUpNarrowWide size={12} /> : <ArrowDownWideNarrow size={12} />
                    )}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          }
        />
        
        <AnimatePresence initial={false}>
          {filteredAndSortedHistory.length === 0 ? (
            <HistoryEmptyState key="empty" searchQuery={searchQuery} />
          ) : (
            <HistoryList
              key="list"
              items={filteredAndSortedHistory}
              selectedIds={selectedIds}
              highlightedId={highlightedId}
              sortBy={sortBy}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onClearSelection={() => setSelectedIds([])}
              onBulkDelete={() => setIsBulkDelete(true)}
              onEntryClick={(item) => handleInteraction(String(item.id), () => setSelectedEntry(item), 200)}
              onDeleteClick={(id) => setDeleteId(id)}
              itemsRef={itemsRef}
              activeEntryId={activeId}
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
