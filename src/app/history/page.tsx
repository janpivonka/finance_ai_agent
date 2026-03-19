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
      
      <style jsx global>{`
        ::-webkit-scrollbar { display: none !important; }
        .reveal { opacity: 0; transform: translateY(20px); will-change: transform, opacity; }
        @keyframes ui-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ui-fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes ui-slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes ui-slideDown { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(20px) scale(0.98); } }
        .animate-gradient-text { animation: gradient-text 6s ease infinite; }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .history-highlight {
          animation: history-highlight-pulse 3s ease-out 1;
        }
        @keyframes history-highlight-pulse {
          0%   { box-shadow: 0 0 0 rgba(217,70,219,0); transform: scale(1); }
          10%  { box-shadow: 0 0 28px rgba(217,70,219,0.22); transform: scale(1.015); }
          52%  { box-shadow: 0 0 34px rgba(217,70,219,0.24); transform: scale(1.015); }
          100% { box-shadow: 0 0 0 rgba(217,70,219,0), transform: scale(1); }
        }

        .report-container, .report-container * {
          background-color: transparent !important;
          background: transparent !important;
        }
        .report-container strong { color: #fff !important; }
        .report-container h1, .report-container h2, .report-container h3 { color: #f8fafc !important; font-weight: 800; }
        .report-container p, .report-container li { color: #cbd5e1 !important; }
        .report-container table { border-collapse: collapse; width: 100%; }
        .report-container td { color: #e2e8f0 !important; font-size: 0.85rem; }
        .report-container th { 
          color: #38bdf8 !important; 
          text-transform: uppercase; 
          font-size: 0.75rem; 
          letter-spacing: 0.05em;
          background-color: rgba(255,255,255,0.03) !important;
        }
        .report-container td:nth-child(2) { 
          color: #ec4899 !important; 
          font-weight: 700; 
        }
        .report-container td:nth-child(3) { 
          color: #4ade80 !important; 
          font-weight: 700; 
        }
        .report-container table, .report-container td, .report-container th {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
